const cron = require('node-cron');
const { getAllUsers } = require('../../db/queries/admin.queries');
const { getAllAlerts, createAlert } = require('../../db/queries/alert.queries');
const { EMERGENCY_CONTACTS_ALERT_TEMPLATE } = require('../../templates/alert.template');
const { EMERGENCY_CONTACTS_ALERT } = require('../../types');
const { countEmergencyContacts } = require('../../db/queries/user.queries');

const initializeCron = () =>{
    cron.schedule('55 1 * * *', async () => {
        console.log('Running cron job to check emergency contacts');
    
        try {
            const users = await getAllUsers()
    
            for (const user of users) {
                const contactCount = await countEmergencyContacts({ where: { userId: user.id } });
                console.log(`${user.firstName} - ${contactCount}`)
                if (contactCount < 5) {
                    const message = EMERGENCY_CONTACTS_ALERT_TEMPLATE;
                    const alertType = EMERGENCY_CONTACTS_ALERT;
                    const existingAlert = await getAllAlerts({ userId: user.id, type: alertType });
                    console.log(`existing alert - ${existingAlert.length}`)
                    if (existingAlert.length < 1) {
                        await createAlert({
                            userId: user.id,
                            type: alertType,
                            message,
                        });
                    }
                }
            }
            console.log('Cron job completed successfully');
        } catch (err) {
            console.error('Error running cron job:', err);
        }
    });
}
module.exports = {initializeCron}

