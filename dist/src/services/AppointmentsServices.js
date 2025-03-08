"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsServices = void 0;
const AppointmentsRepository_1 = require("../repositories/AppointmentsRepository");
const DoctorsRepository_1 = require("../repositories/DoctorsRepository");
const TimesRepository_1 = require("../repositories/TimesRepository");
const SpecialtiesRepository_1 = require("../repositories/SpecialtiesRepository");
const date_fns_1 = require("date-fns");
const util_1 = require("../utils/util");
const PatientsRepository_1 = require("../repositories/PatientsRepository");
class AppointmentsServices {
    constructor() {
        this.appointmentsRepository = new AppointmentsRepository_1.AppointmentsRepository();
        this.patientsRepository = new PatientsRepository_1.PatientsRepository();
        this.doctorsRepository = new DoctorsRepository_1.DoctorsRepository();
        this.specialtiesRepository = new SpecialtiesRepository_1.SpecialtiesRepository();
        this.timesRepository = new TimesRepository_1.TimesRepository();
    }
    async store({ patients_id, specialties_id, doctors_id, date }) {
        const doctors = await this.doctorsRepository.findDoctorId(doctors_id);
        const specialty = await this.specialtiesRepository.find(specialties_id);
        const patients = await this.patientsRepository.findPatient(patients_id);
        if (specialty?.id != doctors?.specialties_id) {
            throw new Error('This doctor does not provide the specified specialty');
        }
        if (!patients) {
            throw new Error('Invalid patient');
        }
        const hour = (0, date_fns_1.getHours)((0, date_fns_1.addHours)(date, +3));
        if (hour <= 8 || hour >= 17) {
            throw new Error('Create Schedule between 8 and 17.');
        }
        const schedules = await this.appointmentsRepository.findSchedules(specialties_id, date);
        if (schedules) {
            throw new Error('There is already a patient scheduled for that time');
        }
        const result = await this.appointmentsRepository.create({
            patients_id,
            specialties_id,
            doctors_id,
            date,
        });
        return result;
    }
    async index({ range, specialties_id }) {
        if (range.start != undefined && range.end != undefined) {
            let start = range.start;
            let end = range.end;
            start = (0, date_fns_1.startOfDay)(new Date(start));
            end = (0, date_fns_1.endOfDay)(new Date(end));
            const result = await this.appointmentsRepository.find({
                specialties_id,
                start,
                end,
            });
            return result;
        }
        throw new Error('Start date or end date not specified');
    }
    async availableDays({ date, specialties_id }) {
        const specialty = await this.specialtiesRepository.find(specialties_id);
        if (!specialty) {
            throw new Error("Specialty doens't exists");
        }
        const schedule = [];
        let doctrs = [];
        let lastDay = new Date(date);
        const tomorow = (0, date_fns_1.addDays)(new Date(), 1);
        const minutesDuration = (0, date_fns_1.getMinutes)(specialty.duration);
        const timers = await this.timesRepository.allTimes();
        let dayWeekAvailable;
        for (let i = 0; i <= 365 && schedule.length <= 7; i++) {
            const validSpaces = timers.filter((timer) => {
                const timerString = timer.days.toString();
                dayWeekAvailable = timerString.includes(lastDay.getDay().toLocaleString('pt-BR'));
                const serviceAvailable = timer.specialties_id.includes(specialties_id);
                return dayWeekAvailable && serviceAvailable;
            });
            if (validSpaces.length > 0) {
                let allDayTimers = {};
                for (let space of validSpaces) {
                    let doctors_id = space.doctors_id;
                    if (!allDayTimers[doctors_id]) {
                        allDayTimers[doctors_id] = [];
                    }
                    allDayTimers[doctors_id] = [
                        ...allDayTimers[doctors_id],
                        ...(0, util_1.breakTimeRange)((0, date_fns_1.format)(lastDay, 'yyyy-MM-dd'), (0, date_fns_1.format)((0, date_fns_1.addHours)(space.startHour, +3), 'HH:mm'), (0, date_fns_1.format)((0, date_fns_1.addHours)(space.endHour, +3), 'HH:mm'), minutesDuration),
                    ];
                }
                for (let doctors_id of Object.keys(allDayTimers)) {
                    const schedules = await this.appointmentsRepository.findByDoctorsId(doctors_id, lastDay);
                    let busySchedules = schedules
                        .map((schedule) => ({
                        start: (0, date_fns_1.format)((0, date_fns_1.addHours)(schedule.date, +3), 'HH:mm'),
                        end: (0, util_1.addMinutesToDate)((0, date_fns_1.addHours)(schedule.date, +3), schedule.Specialties.duration),
                    }))
                        .flat();
                    busySchedules = busySchedules
                        .map((timer) => Object.values(timer))
                        .flat();
                    let freeTimer = (0, util_1.splitByvalue)(allDayTimers[doctors_id]?.map((freeTimer) => {
                        return busySchedules.includes(freeTimer) ? '-' : freeTimer;
                    }), '-')
                        .filter((space) => space.length > 0)
                        .flat();
                    freeTimer = (0, util_1.chunk)(freeTimer, 2);
                    allDayTimers[doctors_id] = freeTimer;
                }
                const doctorsTotal = Object.keys(allDayTimers).length;
                if (doctorsTotal > 0) {
                    if ((0, date_fns_1.isBefore)(tomorow, lastDay)) {
                        doctrs.push(Object.keys(allDayTimers));
                        schedule.push({
                            [(0, date_fns_1.format)(lastDay, 'dd-MM-yyyy')]: allDayTimers,
                        });
                    }
                }
            }
            lastDay = (0, date_fns_1.add)(lastDay, { days: 1 });
        }
        doctrs = [...new Set(doctrs.flat())];
        return {
            doctrs,
            schedule,
        };
    }
}
exports.AppointmentsServices = AppointmentsServices;
