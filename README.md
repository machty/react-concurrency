## react-concurrency experiment

This was created with create-react-app, and since I couldn't figure out how to import from node_modules with the default create-react-app webpack config, here's my hacky approach:

1. `src/concurrency.js` and `src/concurrency/**` are intended to house all of what will become react-concurrency
2. react-concurrency will use a shared concurrency lib (along with the next version of e-c). All of the shared concurrency lib stuff lives in `src/concurrency/external`
3. Every time I tweak something on the e-c extraction side of things (currently on the publicly visible `scheduler-cleanup` branch), I just copy over all the changes directly into `external` via: `rsync -avu --delete ../../../ember/ember-concurrency/addon/-private/external/ src/concurrency/external/`
4. I've also inlined the `use-task` in `src/use-task.js`

