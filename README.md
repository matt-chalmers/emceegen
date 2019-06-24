# genemcee
A simple genetic algorithm library

#### Install
`npm install genemcee`

### Usage
```javascript
    import {Algorithm, Operator} from 'genemcee';
    
    const opts = {
         lazyScore,
         seed,
         crossover,
         select,
         mutate,
         fitness,
         stopCheck,
         steadyState,
         cmp,
     }
    const alg = new Algorithm(opts);
    
    // Subscribe to listen to events
    alg.on('crossover', info => {...});
    alg.on('mutate', info => {...});
    alg.on('evaluation', info => {...});
    alg.on('generation', info => {...});
    alg.on('selection', info => {...});
    alg.on('breed', info => {...});
    alg.on('end', info => {...});
    
    // Simulate the algorithm for 100 iterations of a population of 50 (or until your stopping criteria has been met)
    alg.run(50, 100).then(info => {...});
    
```

## Development
Install dependencies: `npm install`

Run tests: `npm test`
