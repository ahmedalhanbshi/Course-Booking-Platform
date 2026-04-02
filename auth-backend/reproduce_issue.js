const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { TrainerService } = require('./src/services/trainer.service');
const { mailerService } = require('./src/services/mailer.service');

// Mock mailerService.send to avoid actual sending and see the result
const originalSend = mailerService.send;
mailerService.send = async (opts) => {
    console.log('MOCKED MAIL SEND:', opts.to, opts.subject);
    return Promise.resolve();
};

async function test() {
    const trainerService = new TrainerService();
    const trainerId = '91b2b289-8410-4255-85be-f832e88aaa64'; // HammaSH1
    const studentId = '41e24035-ec27-4ba9-92c0-9cd0c99a08df'; // Ahmed Student

    console.log('Testing createStudentAnnouncement (Single User)...');
    try {
        const result = await trainerService.createStudentAnnouncement(trainerId, {
            title: 'Test Title Single',
            message: 'Test Message Single',
            recipientId: studentId
        });
        console.log('Success!', result.id);
    } catch (err) {
        console.error('FAILED (Single User):', err.message);
    }

    console.log('\nTesting createStudentAnnouncement (Broadcast)...');
    try {
        const result = await trainerService.createStudentAnnouncement(trainerId, {
            title: 'Test Title Broadcast',
            message: 'Test Message Broadcast'
        });
        console.log('Success!', result.id);
    } catch (err) {
        console.error('FAILED (Broadcast):', err.message);
    }

    process.exit(0);
}

test();
