const telegramApi = require('node-telegram-bot-api');
const {gameOption, againOptions, createTaskOptions} = require('./options')
require('dotenv').config()
const sequelize = require('./db')
const userModule = require('./models/userModels')
const taskModule = require('./models/taskModuls')

const bot = new telegramApi(process.env.TOKEN, {polling: true})

//1df5fa71
const start = async()=>{
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        let numberAttempts
        let gameId
        const chat = {}
        
        const startGame = async(chatId)=>{
            numberAttempts = 4
            await bot.sendMessage( chatId, 'Зараз бот загадає число від 0 до 9, а ти маєш 4 спроби його вгадати')
            const randomNumber = Math.floor(Math.random() * 10)
            chat[chatId] = randomNumber
            const gameMessageOptions = await bot.sendMessage(chatId, 'Я загадав число. Відгадуйте', gameOption)
            gameId = gameMessageOptions.message_id
        }
    
        bot.setMyCommands([
            {command: '/start', description: 'Запустити бота'},
            {command:'/info', description: 'Переглянути інформацію про тебе'},
            {command:'/game', description: 'Запустити гру'},
            {command:'/addTask', description:'Додати нагадування про нову задачу'} 
        ])
    
        bot.on('message', async (msg) => {
            const text = msg.text
            const chatId = msg.chat.id
            const firstName = msg.from.first_name
            const userName = msg.from.username
            const userIsBot = msg.from.is_bot
            
            try {
                if(text === '/start'){
                    const user = await userModule.findOne({ where: { chatId:chatId.toString() } });
                    if (!user) {
                        await userModule.create({ chatId });
                    }
                    await bot.sendSticker(chatId, 'https://sl.combot.org/utyaduck/webp/4xf09f918b.webp')
                    return bot.sendMessage(chatId, `Привіт! Рада бачити ${firstName} у власному навчальному боті👋`)
                }
                if(text === '/info'){
                    const user = await userModule.findOne({where: {chatId:chatId.toString()}})
                    await bot.sendSticker(chatId, 'https://sl.combot.org/utyaduck/webp/9xf09f988e.webp')
                    return  bot.sendMessage(chatId, `1df5fa71 Я маю таку інформацію про тебе: \n ім'я ${firstName} \n ім'я під яким ти в Telegram ${userName} \n i ти ${userIsBot? 'бот🤖':'користувач👤'} \n у грі було виграно ${user.win} разів, а програно - ${user.fail} разів`)
                }
                if(text === '/game'){
                    await bot.sendSticker(chatId,'https://sl.combot.org/utyaduck/webp/26xf09f93a8.webp')
                    return await startGame(chatId)
                }
                if(text === '/addTask'){
                    await bot.sendSticker(chatId, 'https://sl.combot.org/utyaduck/webp/18xf09f988f.webp')
                    return bot.sendMessage(chatId, 'Вкажіть необхідні дані для створення нової задачі', createTaskOptions)
                }
        
                await bot.sendSticker(chatId, 'https://sl.combot.org/utyaduck/webp/12xf09fa4b7e2808de29982efb88f.webp')
                return bot.sendMessage(chatId, `Я не знаю такої команди, ${firstName} \n Перевірте написання команди знову`)
            } catch (error) {
                console.log(error)
                return await bot.sendMessage(chatId, `Щось пішло не так. Повторіть спробу пізніше`)
            }
        })
    
        bot.on('callback_query', async(msg) =>{
            switch (text) {
                case '/game':
                    const data = msg.data
                    const chatId = msg.message.chat.id
                    if(data === '/again'){
                        await bot.deleteMessage(chatId, gameId )
                        return await startGame(chatId)
                    }
                    bot.sendMessage(chatId, `Ви обрали число ${data}`)
                    if(+data === chat[chatId]){
                        await userModule.update({win: sequelize.literal('win + 1')}, {where: {chatId: chatId.toString()}})
                        await bot.sendSticker(chatId, 'https://sl.combot.org/utyaduck/webp/38xf09fa5b3.webp')
                        return await bot.sendMessage(chatId, 'Вітаю!!! Ви вгадали число', againOptions)
                    }else{
                        numberAttempts--
                        if(numberAttempts<=0){
                            await userModule.update({fail:sequelize.literal('fail + 1')}, {where: {chatId: chatId.toString()}})
                            await bot.sendSticker(chatId, 'https://sl.combot.org/utyaduck/webp/39xf09f98ad.webp')
                            return await bot.sendMessage(chatId, `Ви нажаль програли😔. Бот обрав число ${chat[chatId]}. Можливо пощастить на наступній грі`, againOptions)
                        }
                        await bot.sendSticker(chatId, 'https://sl.combot.org/utyaduck/webp/37xf09f98a2.webp')
                        await bot.sendMessage(chatId, `Нажаль ви не вгадали число. У вас ще є ${numberAttempts} кількість спроб`)
                        return await bot.sendMessage(chatId, `Обране вами число було ${data > chat[chatId] ? 'менше' : 'більше'} загаданого`)
                    }
                case '/addTask':
                    console.log(msg)
                    break
                default:
                    break;
            }
        })
        bot.on("polling_error", err => console.log(err));
    } catch (error) {
        console.log(error)
    }
}
start()