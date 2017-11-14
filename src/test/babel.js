
import assert from 'assert';
import {Sequelize, Model, DataTypes} from 'sequelize';
import {Options, Attributes} from '../index';
import * as sinon from 'sinon';

// Just a dummy
const sequelize = Object.create(Sequelize.prototype);

describe('Babel', () => {
    it('should call Model.init with correct attributes and options', () => {

        const stub = sinon.stub(Model, 'init');

        try {
            @Options({sequelize})
            @Attributes({username: Sequelize.STRING})
            class User extends Model {} // eslint-disable-line no-unused-vars

            assert(stub.calledOnce);

            const attributes = stub.args[0][0];
            const options = stub.args[0][1];

            assert.equal(typeof attributes, 'object');
            assert.equal(attributes.username, DataTypes.STRING);

            assert.equal(typeof options, 'object');
            assert.equal(options.sequelize, sequelize);

        } finally {

            stub.restore();
        }
    });

    it('should call Model.init correctly when only @Options was used', () => {

        const stub = sinon.stub(Model, 'init');

        try {

            @Options({sequelize})
            class User extends Model {}

            sinon.assert.calledOnce(stub);

            const attributes = stub.args[0][0];
            const options = stub.args[0][1];

            assert.equal(typeof attributes, 'object');
            assert.deepEqual(attributes, {});

            assert.equal(typeof options, 'object');
            assert.equal(options.sequelize, sequelize);

        } finally {

            stub.restore();
        }
    });

    it('should inherit attributes from parent when @Attributes was used', () => {

        const stub = sinon.stub(Model, 'init');

        try {
            @Attributes({id: Sequelize.STRING})
            class User extends Model {}

            @Options({sequelize})
            @Attributes({id2: Sequelize.STRING})
            class User2 extends User {}

            let attributes = stub.args[0][0];

            assert.equal(attributes.id, DataTypes.STRING);
            assert.equal(attributes.id2, DataTypes.STRING);
        } finally {

            stub.restore();
        }
    });
})

