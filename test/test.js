describe('KhoaiJS Task', function () {
    var expect = chai.expect,
        chai_assert = chai.assert;
    function task_handler(data, success_cb, error_cb) {
        if (_.isString(data)) {
            success_cb(data + '_');
        } else {
            error_cb('Data must be a string');
        }
    }

    describe('Static property of KhoaiJS', function () {
        it('Task must be a static property of KhoaiJS if exists', function (cb) {
            if (window.hasOwnProperty('Khoai')) {
                chai_assert.property(Khoai, 'Task');
                cb();
            } else {
                cb();
            }
        });
        it('Static property of KhoaiJS and standalone object of Task must be same', function (cb) {
            if (window.hasOwnProperty('Khoai')) {
                chai_assert.strictEqual(Khoai.Task, Task);
                cb();
            } else {
                cb();
            }
        })
    });


    describe('Single task', function () {
        describe('Valid data', function () {
            var task,
                data = '123',
                processed_data = data + '_',
                task_process_result;

            before(function () {
                task = new Task(task_handler);

                task_process_result = task.process(data);
            });

            it('Process result is true', function () {
                chai_assert.isTrue(task_process_result);
            });
            it('Task result must be correct', function () {
                chai_assert.strictEqual(processed_data, task.getResult());
            });
        });

        describe('Invalid data', function () {
            var task,
                data = 123,
                task_process_result,
                error = {
                    code: 0,
                    message: 'Data must be a string'
                };

            before(function () {
                task = new Task(task_handler);

                task_process_result = task.process(data);
            });

            it('Process result is false', function () {
                chai_assert.isFalse(task_process_result);
            });
            it('Task result is null', function () {
                chai_assert.isNull(task.getResult());
            });
            it('Task has error', function () {
                chai_assert.isNotNull(task.getError());
            });
            it('Error is deep equal to expected', function () {
                chai_assert.deepEqual(task.getError(), error);
            });
        });

        describe('Task is error when throw any Exception', function () {
            var task,
                data = 123,
                task_process_result,
                error = {
                    code: 0,
                    message: 'Error by throw new Error exception'
                };

            before(function () {
                task = new Task(function () {
                    throw new Error('Error by throw new Error exception');
                });

                task_process_result = task.process(data);
            });
            it('Process result is false', function () {
                chai_assert.isFalse(task_process_result);
            });
            it('Task result is null', function () {
                chai_assert.isNull(task.getResult());
            });
            it('Task has error', function () {
                chai_assert.isNotNull(task.getError());
            });
            it('Error is deep equal to expected', function () {
                chai_assert.deepEqual(task.getError(), error);
            });
        });
    });
    describe('Multiple task', function () {
        before(function () {
            Task.register('task_1', task_handler);
            Task.register('task_2', task_handler);
            Task.register('task_3', ['task_1', 'task_2']);
        });

        describe('Valid data', function () {
            var task,
                data = '123',
                processed_data = data + '__',
                task_process_result;

            before(function () {
                task = Task.factory('task_3');
                task_process_result = task.process(data);
            });

            it('Process result is true', function () {
                chai_assert.isTrue(task_process_result);
            });
            it('Task result must be correct', function () {
                chai_assert.strictEqual(processed_data, task.getResult());
            });
        });
        describe('Invalid data', function () {
            var task,
                data = 123,
                task_process_result,
                error = {
                    code: 0,
                    message: 'Data must be a string'
                };

            before(function () {
                task = Task.factory('task_3');

                task_process_result = task.process(data);
            });

            it('Process result is false', function () {
                chai_assert.isFalse(task_process_result);
            });
            it('Task result is null', function () {
                chai_assert.isNull(task.getResult());
            });
            it('Task has error', function () {
                chai_assert.isNotNull(task.getError());
            });
            it('Error is deep equal to expected', function () {
                chai_assert.deepEqual(task.getError(), error);
            });
        });
    });
    describe('Apply data to multiple task', function () {
        describe('Valid data', function () {
            var task,
                data = '123',
                processed_data = {
                    data: data + '_'
                },
                task_process_result;

            before(function () {
                Task.register('apply_task', task_handler);

                task_process_result = Task.apply(data, 'apply_task');
            });

            it('Task result must be correct', function () {
                chai_assert.deepEqual(processed_data, task_process_result);
            });
        });
        describe('Invalid data', function () {
            var data = 123,
                processed_data = {
                    error: {
                        code: 0,
                        message: 'Data must be a string'
                    }
                },
                task_process_result;

            before(function () {
                Task.register('apply_task_invalid_data', task_handler);

                task_process_result = Task.apply(data, 'apply_task_invalid_data');
            });

            it('Process result is error', function () {
                chai_assert.isObject(task_process_result);
                chai_assert.property(task_process_result, 'error');
            });
            it('Task result must be correct', function () {
                chai_assert.deepEqual(processed_data.error, task_process_result.error);
            });
        });
    });
});