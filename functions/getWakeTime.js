function getWakeTime() {
    const date = new Date();
    const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const mins = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const timeZ   = /\((.*)\)/.exec(new Date().toString())[1];
    const tz = timeZ.match(/[A-Z]+/g).join("");
    const am_pm = hour >= 12 ? "PM" : "AM";

    return `${hour}:${mins} ${am_pm} ${tz}`;
}

module.exports = getWakeTime;
