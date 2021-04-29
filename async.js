let Async = function () {
    let self = this;

    this.map = function (array, func, callback) {

        let count = array.length;
        let errors = [];
        let results = [];

        for (let i = 0; i < array.length; i++) {
            ((i) => { // Additional securing linked to the loop 
                func(array[i], (error, result) => {
                    count--;

                    if (error) {
                        errors[i] = error;
                    }
                    else {
                        results[i] = result;
                    }

                    if (count < 1) {
                        return callback((errors.length > 0) ? errors : null, results);
                    }
                });
            })(i);
        }
    };

    this.Waterfall = function () {

        let jobs = arguments[0];
        let callback = (arguments.length > 2) ? arguments[2] : arguments[1];

        let job = jobs.shift(); // Get and remove first element

        let callbackAfter1 = function (error, result) {
            if (error) {
                return callback(error);
            }

            if (jobs.length < 1) {
                return callback(null, result);
            }

            let callbackAfter2 = function (error, result) {
                if (error) {
                    return callback(error);
                }
                else {
                    return callback(null, result);
                }
            };

            let args = [];
            args.push(jobs);

            if (result != undefined) {
                args.push(result);
            }

            args.push(callbackAfter2);

            self.Waterfall.apply(this, args);
        };

        let args = [];

        if (arguments.length > 2) {
            args.push(arguments[1]);
        }

        args.push(callbackAfter1);

        // Call functon with arguments
        job.apply(this, args);
    };
};

module.exports = new Async();