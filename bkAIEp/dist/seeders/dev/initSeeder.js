"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const models_1 = require("../../app/models");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const moment_1 = __importDefault(require("moment"));
const run = async (_params, console) => {
    try {
        const patients = [
            {
                first_name: "Christos",
                last_name: "Tingcomb",
                email: "ctingcomb0@aboutads.info",
                gender: "male",
                age: 25,
                "document_id": 1026300124,
                "blood_type": "A+",
                "emergency_contact_name": "Christos Tingcomb",
                "emergency_contact_phone": "4128328536",
            },
            {
                first_name: "Pedro",
                last_name: "Garcia",
                email: "pedrodsgarcia@aboutads.info",
                gender: "male",
                age: 28,
                "document_id": 1026300132,
                "blood_type": "AB+",
                "emergency_contact_name": "Pedro Garcia",
                "emergency_contact_phone": "4128548536",
            }
        ];
        const events = [
            {
                datetime: moment_1.default.utc().toISOString(),
                person: "Zadiaz",
                type: "Consulta General",
                file: "patientes/{{1}}/file.mri"
            },
            {
                datetime: moment_1.default.utc().toISOString(),
                person: "Zadiaz",
                type: "Control",
                file: "patientes/{{1}}/file.eeg"
            }
        ];
        const exams = [
            {
                datetime: moment_1.default.utc().toISOString(),
                detail: "Detail del examen MRI",
                type: "MRI",
                file: "mri-exams/user-{{1}}-exam-{{EXAMID}}.zip",
                path: "mri/{{1}}/{{EXAMID}}"
            },
            {
                datetime: moment_1.default.utc().toISOString(),
                detail: "Detail del examen EEG",
                type: "EEG",
                file: "patientes/{{1}}/file.eeg",
                path: "patientes/{{1}}/file.eeg"
            }
        ];
        const examsCopy = exams.map(obj => ({ ...obj }));
        const predictions = [
            {
                date_requested: moment_1.default.utc().toISOString(),
                label: "Going"
            },
            {
                date_requested: moment_1.default.utc().toISOString(),
                label: "Stopped"
            }
        ];
        for (const patient of patients) {
            const exists = await models_1.Patient.findOne({
                where: {
                    document_id: patient.document_id
                }
            });
            let _patient = exists;
            if (exists) {
                await models_1.Patient.update(patient, { where: { document_id: patient.document_id } });
            }
            else {
                _patient = await models_1.Patient.create(patient);
            }
            for (const event of events) {
                event.file = event.file.replace('{{1}}', _patient['id']);
                event['patient_id'] = _patient['id'];
                await models_1.Event.create(event);
            }
            for (const exam of examsCopy) {
                exam.file = exam.file.replace('{{1}}', _patient['id']);
                exam.path = exam.path.replace('{{1}}', _patient['id']);
                exam['patient_id'] = _patient['id'];
                // await Exam.create(exam)
                await models_1.Exam.create({
                    // @ts-ignore
                    "datetime": moment_1.default.utc().toISOString(),
                    detail: "Detail del examen MRI",
                    type: "MRI",
                    file: "user-{{1}}-exam-{{EXAMID}}.zip".replace('{{1}}', _patient['id']),
                    path: "mri/{{1}}/{{EXAMID}}".replace('{{1}}', _patient['id']),
                    patient_id: _patient['id']
                });
            }
            for (const prediction of predictions) {
                prediction['patient_id'] = _patient['id'];
                await models_1.Prediction.create(prediction);
            }
        }
        const permissions = [
            {
                module: 'exams',
                access: 'exams:mri',
                roles: ['admin', 'nurse', 'doctor']
            },
            {
                module: 'exams',
                access: 'exams:info',
                roles: ['admin', 'nurse', 'doctor']
            },
            {
                module: 'exams',
                access: 'exams:arn',
                roles: ['admin', 'nurse', 'doctor']
            },
            {
                module: 'exams',
                access: 'exams:eeg',
                roles: ['admin', 'nurse', 'doctor']
            },
            {
                module: 'exams',
                access: 'exams:fis',
                roles: ['admin', 'nurse', 'doctor']
            },
            {
                module: 'exams',
                access: 'exams:med',
                roles: ['admin', 'nurse', 'doctor']
            },
            {
                module: 'exams',
                access: 'exams:nes',
                roles: ['admin', 'nurse', 'doctor']
            },
            {
                module: 'patients',
                access: 'patients:info',
                roles: ['admin', 'nurse', 'doctor']
            },
            {
                module: 'predictions',
                access: 'predictions:info',
                roles: ['admin', 'doctor']
            },
            {
                module: 'events',
                access: 'events:info',
                roles: ['admin', 'doctor']
            },
        ];
        const roles = [
            {
                name: 'nurse'
            },
            {
                name: 'doctor'
            },
            {
                name: 'admin'
            }
        ];
        for (const role of roles) {
            const exists = await models_1.Role.findOne({
                where: {
                    name: role.name
                }
            });
            let _role = exists;
            if (exists) {
                await models_1.Role.update(role, { where: { name: role.name } });
                role['id'] = exists.dataValues.id;
            }
            else {
                _role = await models_1.Role.create(role);
                role['id'] = _role.dataValues.id;
            }
        }
        for (const permission of permissions) {
            const _roles = permission.roles;
            delete permission.roles;
            const exists = await models_1.Permission.findOne({
                where: {
                    access: permission.access
                }
            });
            let _permission = exists;
            if (exists) {
                await models_1.Permission.update(permission, { where: { access: permission.access } });
                permission['id'] = exists.dataValues.id;
            }
            else {
                _permission = await models_1.Permission.create(permission);
                permission['id'] = _permission.dataValues.id;
            }
            const __p = await models_1.Permission.findOne({
                where: {
                    id: permission['id']
                }
            });
            for (const role of _roles) {
                const _role = roles.find(_r => _r.name === role);
                const __r = await models_1.Role.findOne({
                    where: {
                        id: _role['id']
                    }
                });
                await __r['addPermission'](__p, { through: { selfGranted: false } });
            }
            const users = [
                {
                    username: 'admin',
                    password: 'admin',
                    first_name: 'admin',
                    position: 'admin',
                    role_id: null,
                    role: 'admin'
                },
                {
                    username: 'doctor',
                    password: 'doctor',
                    first_name: 'doctor',
                    position: 'doctor',
                    role_id: null,
                    role: 'doctor'
                },
                {
                    username: 'nurse',
                    password: 'nurse',
                    first_name: 'nurse',
                    position: 'nurse',
                    role_id: null,
                    role: 'nurse'
                }
            ];
            for (const user of users) {
                const role = roles.find(_r => _r.name === user.role);
                delete user.role;
                user.role_id = role['id'];
                const exists = await models_1.User.findOne({
                    where: {
                        username: user.username
                    }
                });
                const salt = await bcryptjs_1.default.genSalt(10);
                const hash = await bcryptjs_1.default.hash(user.password, salt);
                user.password = hash;
                let _user = exists;
                if (exists) {
                    await models_1.User.update(user, { where: { username: user.username } });
                    user['id'] = exists.dataValues.id;
                }
                else {
                    _user = await models_1.User.create(user);
                    user['id'] = _user.dataValues.id;
                }
            }
        }
    }
    catch (error) {
        console.log('error', error);
        return false;
    }
    return true;
};
exports.run = run;
//# sourceMappingURL=initSeeder.js.map