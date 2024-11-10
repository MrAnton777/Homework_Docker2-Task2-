const express = require('express')
const { v4: uuid } = require('uuid')
const fileMulter = require('../middleware/file')
const fs = require('fs')
const { title } = require('process')
const router =  express.Router()
const request = require('request')
const axios = require('axios')


class Book {
    constructor(title = "", desc = "",authors = "",favourite = "",fileCover = "",fileName = "",fileBook = "",id = uuid(),) {
        this.title = title
        this.desc = desc
        this.authors = authors
        this.favourite = favourite
        this.fileCover = fileCover
        this.fileName = fileName
        this.fileBook = fileBook
        this.id = id
    }
}

const stor = {
    books: [
        new Book('test1','desc','ok','ok','ok','ok')
    ],
};

router.get('/books', (_req, res) => {
    const {books} = stor
    res.render('../view/book/index',{
        title: "Books",
        books: books
    })
})

router.get('/books/:id', async (req, res) => {
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)
    

    const countRes = await axios.get(`http://counter:3001/counter/${id}`);


    if( idx === -1) {
        res.redirect('/404')
    } else {
        res.render("../view/book/view",{
            title:"Book View",
            book:books[idx],
            cnt:countRes.data.cnt
        })
        
    }

    await axios.post(`http://counter:3001/counter/${id}/incr`);
    

})


router.get('/create',(req,res) =>{
    res.render('../view/book/create',{
        title:"Create book",
        book:{},
    })
})

router.post('/create', (req, res) => {
    const {books} = stor
    const {title, desc,authors,favourite,fileCover,fileName} = req.body

    if (!title || !desc || !authors) {
        res.status(400).json({ error: "Missing required fields" })
    
        return
    
    }
    try{
        const newBook = new Book(title, desc,authors,favourite,fileCover,fileName)
        books.push(newBook)

        res.status(201)
        res.redirect("/api/books")
    } catch (err){
        res.status(500).json({ error: "Internal Server Error" })
    }
})

router.get('/books/update/:id',(req,res)=>{
    let {books} = stor
    let {id} = req.params
    const idx = books.findIndex(el => el.id === id)

    if (idx === -1) {
        res.redirect('/404');
    }

    res.render('../view/book/update',{
        title:"Book Update",
        book:books[idx]
    })
 })

router.post('/books/update/:id', (req, res) => {       
    const {books} = stor
    const {title, desc,authors,favourite,fileCover,fileName} = req.body
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)    

    if (idx !== -1){
        books[idx] = {
            ...books[idx],
            title,
            desc,
            authors,
            favourite,
            fileCover,
            fileName
        }


        res.redirect(`/api/books/${id}`)
    } else {
        res.redirect('/404')
    }
})



router.delete('/books/:id', (req, res) => {
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)
     
    if(idx !== -1){
        books.splice(idx, 1)
        res.json('ok')
    } else {
        res.status(404)
        res.json('404 | страница не найдена')
    }
})

router.post('/books/login',(_req,res) =>{
    res.status(201)
    res.json({ id: 1, mail: "test@mail.ru" })
})

router.post('/books/:id/upload',fileMulter.single('test-file'),(req,res)=>{
    let {books} = stor
    let {id} = req.params
    let {path} = req.file
    const idx = books.findIndex(el => el.id === id)
    if (idx!==-1){
        books[idx].fileBook = path
        res.json('ok')
    }else{res.json('incorrect id | undefinded error')}

})

router.get('/books/:id/download',(req,res)=>{
    let {books} = stor
    let {id} = req.params
    const idx = books.findIndex(el => el.id === id)
    if (idx!==-1){
        let fileExist = fs.existsSync(books[idx].fileBook)
        if (fileExist){
            res.download(books[idx].fileBook)
        }
        else{
            res.json('book not found')
        }
    }else{res.json('incorrect id | undefinded error')}
})


module.exports = router