import Toy from '../models/Toy'
import {RequestHandler} from 'express'
import {IToy} from "../types/common";

export const create: RequestHandler = async (req, res) => {
    const {
        title,
        desc,
        status,
    } = req.body

    let files: string[] = []
    if (req.files) {
        const fl: Express.Multer.File[] = req.files as Express.Multer.File[]
        files = fl.map(img => '/' + img.path)
    }

    const toy = new Toy(title, desc, status, files)
    await toy.save()

    res.status(201).render('admin/add_toy', {toy})
}

export const remove: RequestHandler = async (req, res) => {
    const id = req.params.id
    await Toy.deleteById(id)
    const {ADMIN_PASSWORD} = process.env
    res.redirect(`/admin/?pass=${ADMIN_PASSWORD}`)
}

export const edit: RequestHandler = async (req, res) => {
    const id = req.params.id
    const {
        title,
        desc,
        status,
    } = req.body
    const toy: IToy = {
        title,
        desc,
        status,
    }

    let files: string[] = []
    if (req.files) {
        const fl: Express.Multer.File[] = req.files as Express.Multer.File[]
        files = fl.map(img => '/' + img.path)
    }
    toy.images = files
    await Toy.updateById(id, toy)
    res.status(200).render('admin/toy', {toy})
}

export const all: RequestHandler = async (req, res) => {
    const query: string = req.query.search_query as string || ''

    const toys = await Toy.search(query)
    console.log(toys)


    res.status(200).render('admin/all_toys', {toys})
}