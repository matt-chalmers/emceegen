
/**
 * A Selector takes a population and applies a strategy to reduces it to
 * the target size. This keeps the population at a steady state.
 */
class AbstractSelector {
    /**
     * Perform a population selection
     *
     * @param {object[]} population - an array of population genomes
     * @param {NUmber} targetPopSize - the size we must reduce the population to
     * @return {object[]} new population
     */
    run(population, targetPopSize) {
        throw new Error('Not yet implemented')
    }

    /**
     * Check this population and targetPopSize make sense
     *
     * @param {object[]} population - an array of population genomes
     * @param {Number} targetPopSize - the size we must reduce the population to
     * @throws {Error} Error when invalid
     */
    validate(population, targetPopSize) {
        if (targetPopSize < population.length) {
            throw new Error('Population size too small, cannot apply selector');
        }
    }
}

/**
 * Truncation selector will keep the Fittest genomes only
 */
class Truncation extends AbstractSelector {
    run(population, targetPopSize) {
        this.validate(population, targetPopSize);
        return population => population.slice(-targetPopSize);
    }
}

export const Selector = {
    Truncation,
};
