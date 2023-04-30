//引入joi验证
const Joi = require('joi');

//定义对象的验证规则
const schema = {
    username: Joi.string().min(2).max(5).required().error(new Error('username属性没有通过验证')),
    birth: Joi.number().min(1900).max(2022).error(new Error('birth没有通过验证'))
};



async function run() {
    try{
        //实施验证
        await Joi.validate({username: 'ab'}, schema)
    }
    catch (e) {
        console.log(e);
        return;
    }
    console.log('验证通过')
}

run();