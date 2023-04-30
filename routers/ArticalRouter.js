const express = require('express');
//调用用户集合构造函数
const { Article } = require('../db/article');
const { Comment } = require('../db/comment');
// 创建博客展示页面路由,返回的是路由对象
const router = express.Router();
const pagination = require('mongoose-sex-page')


// 查看帖子  /artical/detail?id=xxx
router.get("/detail", async (req, res)=> {
    let id = req.query.id
    let article = await Article.findById({ _id: id })
    if (article) {
        // 帖子观看人数+1
        let {viewcount} = article
        console.log("viewcount:",viewcount)
        console.log("article:", article)
        await Article.updateOne({ _id: id }, {
            viewcount: viewcount+1
        })
        // if (article1) {
        //     res.send({
        //         code: 200,
        //         msg: "帖子观看+1成功"
        //     })
        // } else {
        //     res.send({
        //         code: 500,
        //         msg: "帖子观看+1失败"
        //     })
        // }

        // 相关评论也发过去
        let comment = await Comment.find({aid: id})
        console.log("comment: \n",comment)

        res.send({
            code: 200,
            msg: "查看成功",
            article,
            comment
        })
    } else {
        res.send({
            code: 500,
            msg: "查看失败"
        })
    }
})

// 添加帖子
router.post("/add", async (req, res) => {
    let { categoryid, title, content, authorid, viewcount, replycount } = req.body;
    let article = await Article.create({
        categoryid,
        title,
        content,
        authorid,
        viewcount,
        replycount,
    })
    if (article) {
        res.send({
            code: 200,
            msg: "添加成功"
        })
    } else {
        res.send({
            code: 500,
            msg: "添加失败"
        })
    }
})

// 删除帖子 /artical/delete?id=xxx
router.delete("/delete", async (req, res) => {
    let id = req.query.id;
    let artical = await Article.deleteOne({ _id: id })
    if (artical) {
        res.send({
            code: 200,
            msg: "删除成功"
        })
    } else {
        res.send({
            code: 500,
            msg: "删除失败"
        })
    }
})

// 查找帖子
router.get("/search", async (req,res) => {
    let { keyword, categoryid, page, pageSize } = req.query;

    // 若没传，则赋默认值
    page = page == null ? 1 : page;
    pageSize = pageSize == null ? 10 : pageSize
    categoryid = categoryid == null ? 0 : categoryid
    keyword = keyword == null ? "" : keyword
    
    // 正则表达  /.(keyword)/gi
    let re = new RegExp("\.(" + keyword + ")", "g")
    let articals;
    if (keyword !== "") {
        console.log("有keyword")
        articals = await pagination(Article).find({ title: { $regex: keyword, $options: "i" } }).page(page).size(pageSize).display(3).exec();
    } else if (categoryid != 0) {
        console.log("没有keyword，有分类")
        articals = await pagination(Article).find({ categoryid: categoryid }).page(page).size(pageSize).display(3).exec();
    } else {
        console.log("没有keyword，没有分类")
        // articals = await pagination(Article).find({ title: re }).page(page).size(pageSize).display(3).exec();
        articals = await pagination(Article).find().page(page).size(pageSize).display(3).exec();

    }

    // 转换格式
    let articals1 = JSON.stringify(articals)
    let articals2 = JSON.parse(articals1)

    console.log("articals2", articals2)

    if (articals2) {
        res.send({
            code: 200,
            msg: "查询成功",
            data: {
                keyword,
                categoryid,
                page,
                pageSize,
                articals2,
                count: articals2.records.length
            }
        })
    } else {
        res.send({
            code: 500,
            msg: "查询失败",
        })
    }


})


// 将路由对象作为模块成员进行导出
module.exports = router;