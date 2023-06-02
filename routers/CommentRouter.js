const express = require('express');
//调用用户集合构造函数
const { Comment } = require('../db/comment');
const { Article } = require('../db/article');
const {User} = require("../db/user")
// 创建博客展示页面路由,返回的是路由对象
const router = express.Router();
const pagination = require('mongoose-sex-page')

const fs = require("fs")
// 配置雪花随机数生成
const GenId = require("../utils/SnowFlake")
const genid = new GenId({ WorkerId: 1 })

// 查询所有评论
router.get("/list", async (req, res)=> {
    let comments = await Comment.find()
    if(comments){
        // 查到所有评论
        res.send({
            code:200,
            msg: "查到所有评论",
            data: comments
        })
    }else{
        res.send({
            code: 404,
            msg: "未查到评论",
        })
    }
})

// 查询某用户发布的所有评论（父级评论）
router.get("/user", async (req, res)=> {
    let id = req.query.id
    let comments = await Comment.find({ uid: id, isparent: 0 })
    if(comments){
        // 查到该用户的父级评论
        res.send({
            code:200,
            msg: "查到该用户的父级评论",
            data: comments
        })
    }else{
        // 未查到该用户的评论
        res.send({
            code: 404,
            msg: "未查到该用户的父级评论",
        })
    }
})


// 添加一条父评论或子评论
router.post("/add",async (req, res)=> {
    const {content, uid, aid, isparent, parentid, imgpath} = req.body;

    // 验证帖子aid是否存在
    // let article = Article.findOne({_id: aid})  这么写没法使用解构赋值
    let article = await Article.findById({_id: aid})
    console.log("article:",article)
    if(article){
        // 帖子存在
        // 帖子评论数+1
        let {replycount}  = article
        console.log("replycount:",replycount)
        await Article.updateOne({ _id: aid }, {
            replycount: replycount+1
        })

        if(isparent!==0){
            // 若不是父评论，验证父评论parendid是否存在
            let comment = Comment.findOne({_id: parentid})
            if(comment){
                // 存在父评论
                let newcomment = await Comment.create({
                    aid,
                    uid,
                    content,
                    isparent,
                    parentid,
                    imgpath
                })
                if(newcomment){
                    res.send({
                        code: 200,
                        msg: "添加子评论成功"
                    })
                }else{
                    res.send({
                        code: 500,
                        msg: "添加子评论失败"
                    })
                }
            }
        }else {
            // 是父评论
            let newcomment = await Comment.create({
                aid,
                uid,
                content,
                isparent,
                parentid,
                imgpath
            })
            if(newcomment){
                res.send({
                    code: 200,
                    msg: "添加父评论成功"
                })
            }else{
                res.send({
                    code: 500,
                    msg: "添加父评论失败"
                })
            }
        }
        
    }


})

// 管理员删除父评论或子评论（首先需要有登录状态，谁要删除评论）
router.get("/delete", async (req,res) => {
    let id = req.query.id;
    let uid = req.query.uid
    let token = req.headers['authorization'];
    if (!token) {
        // 若未携带token，不允许
        return res.status(401).json({ message: '没有提供Token' });
    }
    // 判断是否为管理员的token
    token = token.split(' ')[1]
    let user = await User.findOne({token: token})
    if (!user) {
        return res.status(401).json({ message: '没有有效提供Token' });
    }
    let { role } = user
    // 如果是管理员
    if(role === "admin"){
        let comment = await Comment.deleteOne({_id: id})
        console.log("comment:\n",comment)
        if(comment.deletedCount === 1) {
            res.send({
                code:200,
                msg: "删除评论成功"
            })
        }else {
            res.send({
                code:500,
                msg:"删除评论失败， 不存在"
            })
        }
    }else {
        // 是用户
        let comment = await Comment.deleteOne({_id: id, uid: uid})
        console.log("comment:\n",comment)
        if(comment.deletedCount === 1) {
            res.send({
                code:200,
                msg: "删除自己的评论成功"
            })
        }else {
            res.send({
                code:500,
                msg:"删除评论失败，没有权限删除他人评论"
            })
        }
    }
    


})

// 查找某帖子的所有评论
router.get("/artical", async(req,res) => {
    let id = req.query.id
    let comments = await Comment.find({aid:id}).populate('uid')
    // 拼接用户姓名

    if(comments) {
        // 查找到该用户的所有父级评论
        res.send({
            code:200,
            msg: "查到该帖子的所有评论",
            data: comments
        })
    }else{
        //未查到
        res.send({
            code:200,
            msg:"未查到该帖子的所有评论"
        })
    }
})




module.exports = router