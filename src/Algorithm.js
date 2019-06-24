import EventEmitter from 'events';

let noop = () => false;
let numericCmp = (x,y) => (x - y);


export class Algorithm extends EventEmitter {

    /**
     * Create a genetic Algorithm
     *
     * FIX ME - document this properly!
     * opts = {
            // required
            seed: func, initialises a genome out of thin air
            fitness: func, score a genome
            select: object, with a run() method to cull the population
            crossover: object, with a run() method to breed two genomes and produce a child genome

            // optional
            stopCheck: function to check if we should stop the algorithm, called after each generation
            mutate: function to mutate a genome
            lazyScore: boolean, controls whether to only call fitness func once for a given genome
            steadyState:
        }
     *
     * */
    constructor(opts) {
        super();
        this._initialiseOpts(opts);
    }

    _initialiseOpts(opts) {
        if ( !opts.seed ) {
            throw new Error('A seed function must be provided!');
        }

        if ( !opts.fitness ) {
            throw new Error('A fitness function must be provided!');
        }

        if ( !opts.select ) {
            throw new Error('A selector function must be provided!');
        }

        if ( !opts.crossover ) {
            throw new Error('A crossover function must be provided!');
        }

        this._opts = Object.assign({}, opts);

        this._opts.stopCheck = this._opts.stopCheck || noop;
        this._opts.mutate = this._opts.mutate || noop;
        this._opts.cmp = this._opts.cmp || numericCmp;
    }

    async _scoreGenome(genome) {
        genome._fitness = await this._opts.fitness(genome);
        genome._scored = true;
    }

    async _scorePopulation(population, lazy) {
        const promises = [];
        for ( let genome of population ) {
            if ( lazy && genome._scored ) {
                continue;
            }
            promises.push(this._scoreGenome(genome));
        }
        await Promise.all(promises);
        const cmp = this._opts.cmp;
        population.sort((x,y) => cmp(x._fitness, y._fitness));
    }

    _initGenome(genome) {
        genome._fitness = null;
        genome._scored = false;
    }

    async _initPopulation(popSize) {
        const promises = [];
        for (let i = 0; i < popSize; i++) {
            promises.push(this._opts.seed());
        }
        let population = await Promise.all(promises);
        for (const genome of population) {
            this._initGenome(genome);
        }
        await this._scorePopulation(population);
        return population;
    }

    async _breedChild(parents) {
        if (parents.length <= 1) {
            throw new Error('Not enough parents to breed a child');
        }

        let parentAIdx = Math.floor(Math.random() * parents.length);
        let parentBIdx;
        while (true) {
            parentBIdx = Math.floor(Math.random() * parents.length);
            if (parentAIdx !== parentBIdx) {
                break;
            }
        }
        let genomeA = parents[parentAIdx];
        let genomeB = parents[parentBIdx];

        let childGenome = await this._opts.crossover.run(genomeA, genomeB);
        this.emit('crossover', {genomeA, genomeB, childGenome});

        let mutatedGenome = await this._opts.mutate(childGenome);
        this.emit('mutate', {original: childGenome, mutated: mutatedGenome});

        this._initGenome(mutatedGenome);
        return mutatedGenome;
    }

    async _breedChildren(numOffspring, parents) {
        const promises = [];
        for ( let i = 0; i < numOffspring; i++ ) {
            promises.push(this._breedChild(parents));
        }
        return Promise.all(promises);
    }

    async _run(popSize, iterations) {
         const opts = this._opts;

        let population = await this._initPopulation(popSize);
        let leader = population[population.length - 1];
        const memo = [leader];
        this.emit('evaluation', {leader, population});
        this.emit('generation', {generation: 0, leader, parents: {}, population});

        for ( let generation = 1; generation <= iterations; generation++ ) {

            let population = await opts.select.run(population, popSize);
            this.emit('selection', {population});

            let numOffspring = Math.floor(population.length / 2);
            let offspring = await this._breedChildren(numOffspring, population);
            this.emit('breed', {offspring});

            population = population.concat(offspring);

            await this._scorePopulation(population, opts.lazyScore);
            leader = population[population.length - 1];
            memo.push(leader);
            this.emit('evaluation', {leader, population});
            this.emit('generation', {generation, leader, population});

            if ( opts.stopCheck(leader, population) ) {
                break;
            }
        }

        const info = {
            leaders: memo,
            solution: leader,
        };
        return info;
    }

    /**
     * Run a genetic simulation and determine the fittest individual found
     *
     * @param {Number} popSize - the number of individuals in the simulation population
     * @param {Number} iterations - the number of population generations to simulation
     * @return {Promise<{solution: *, leaders: *[]}>}
     */
    async run(popSize, iterations) {
        let info;
        try {
            info = await this._run(popSize, iterations);
        } catch (err) {
            this.emit('error', err);
            throw err;
        }
        this.emit('end', info);
        return info;
    }
}
