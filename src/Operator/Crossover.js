/**
 * A Crossover takes two genomes and combines them to make a new genome
 */
class AbstractCrossover {
    /**
     * Perform the crossover
     * @param {object} genomeA
     * @param {object} genomeB
     * @return new genome
     */
    run(genomeA, genomeB) {
        throw new Error('Not yet implemented');
    }

    /**
     * Check these genomes make sense for crossing
     *
     * @param {object} genomeA
     * @param {object} genomeB
     * @throws {Error} Error when invalid
     */
    validate(genomeA, genomeB) {
        if ( genomeA.length != genomeB.length ) {
            throw new Error('Genome lengths do not match');
        }
    }
}

/**
 * A Uniform crossover assigns genes randomly to the child from the parents
 */
class Uniform extends AbstractCrossover {
    run(genomeA, genomeB) {
        this.validate(genomeA, genomeB);
        let dnaLength = genomeA.length;
        let newDNA = [];
        for (let geneIdx = 0; geneIdx < dnaLength; geneIdx++) {
            const parentIdx = Math.floor(Math.random() * 2);
            const genome = parentIdx === 1 ? genomeA : genomeB;
            newDNA.push(genome[geneIdx]);
        }
        return newDNA;
    }
}


export const Crossover = {
    Uniform,
};
