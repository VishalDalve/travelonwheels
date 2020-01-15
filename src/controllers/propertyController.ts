import * as express from 'express';
// import * as speakEasy from 'speakeasy';
import * as mongoose from 'mongoose';
import * as passwordHash from 'password-hash';
import * as fs from 'fs';
import * as path from 'path';


import Validator from '../validator/userValidator';
import { default as config } from '../env/index';
import PropertyModel, { IPropertyModel } from '../models/propertyModel';
import AuthService from '../service/authService';
import { Messages } from '../util/message';
import { upload } from '../service/fileUpload';
import propertyModel from '../models/propertyModel';
const jwt = require('jsonwebtoken');
import UserModel, { IUserModel } from '../models/userModel'

// const client = require('twilio')(config.envConfig.twilioCred.accountSid, config.envConfig.twilioCred.authToken);


class PropertyController {


    /**
    * @param  {any} req Add Property New
    * @param  {express.Response} res
    * @param  {express.NextFunction} next
    */
    public async addproperty(req: any, res: express.Response, next: express.NextFunction): Promise<any> {

        try {
            // console.log("ServerProperty ", req.body);
            // console.log("ServerPropertyFiles ", req.files);

            var imgs = [];
            var video: any = req.body.videos;

            //Traversing & categorising files according to type ---------
            if (req.files)

                for (let i = 0; i < req.files.length; i++) {

                            imgs.push(req.files[i].path);
                   
                }

            req.body.images = imgs;

            let property: any = await propertyModel.create(req.body);

            return res.status(200).json({ "message": "Plan Added Successfully ", "Plan": property })

        } catch (e) {
            return res.status(500).json({ "message": Messages.ERROR_500, "Error": e })
        }

    }

   

    /**
     * @param  {any} req update property
     * @param  {express.Response} res
     * @param  {express.NextFunction} next
     */
    public async update(req: any, res: express.Response, next: express.NextFunction): Promise<any> {

        try {

            console.log("UpdateProprty:", req.body);

            let property = await propertyModel.findOne({ _id: req.body.propertyId });

            if (!property)
                res.status(404).send({ "message": Messages.ERROR_404 })

            console.log("req.file:", req.files);

            var imgs = [];

            //Traversing & categorising files according to type ---------
            if (req.files)

                for (let i = 0; i < req.files.length; i++) {

                            imgs.push(req.files[i].path);
                  
                }
                property.title = req.body.propertyName;
                property.category = req.body.category;
                property.price = req.body.price;
                property.description = req.body.description;
                property.overview = req.body.overview;
                property.itinerary = req.body.itinerary;
                property.inclusions = req.body.inclusions;
                property.exclusions = req.body.exclusions;
                property.extras = req.body.extras;
                property.isActive = req.body.isActive;
                property.isDeleted = req.body.isDeleted;
                property.images = imgs;

                let propertyupdate = await propertyModel.findOneAndUpdate({_id: req.body.propertyId},property);
                if(!propertyupdate) {
                res.status(404).send(Messages.ERROR_404)
                }

            return res.status(200).json({ "message": "Plan updated successfully" })

        } catch (e) {
            return res.status(500).json({ "message": e.message || Messages.ERROR_500 })
        }

    }

    /**
   * @param  {any} req Delete prorperty by id
   * @param  {express.Response} res
   * @param  {express.NextFunction} next
   */
    public async deleteProperty(req: any, res: express.Response, next: express.NextFunction): Promise<any> {

        try {
            // console.log("Server ", req.body);

            //let property = await PropertyModel.findOneAndRemove({ _id: req.body.propertyId });
            let property = await PropertyModel.findOneAndUpdate({ _id: req.body.propertyId },{ isDeleted: true});

            if (!property) {
                res.status(404).send(Messages.ERROR_404)
            }
            return res.status(200).json({ "property": property, "message": "Deleted Successfully" })

        } catch (e) {
            return res.status(500).json({ "message": Messages.ERROR_500 })
        }

    }

    /**
    * @param  {any} req GET prorperty by id
    * @param  {express.Response} res
    * @param  {express.NextFunction} next
    */
    public async getPropertybyId(req: any, res: express.Response, next: express.NextFunction): Promise<any> {

        try {

            console.log("PrpByiD", req.params.id);

            let fav: Boolean = false;

            const property: any = await PropertyModel.aggregate([
                {
                    "$match": {
                        "_id": mongoose.Types.ObjectId(req.params.id)
                    }
                },
                {
                    "$project": {
                       
                    }
                }

            ]);

            if (!property) {
                return res.status(404).send(Messages.ERROR_404);
            }
           
            return res.status(200).json({ "property": property, "message": "Successfully Retrived" });

        } catch (e) {
            console.log(e.message);

            return res.status(500).json({ "message": Messages.ERROR_500 })
        }
    }


    /**
  * @param  {any} req prorperty Advance search
  * @param  {express.Response} res
  * @param  {express.NextFunction} next
  */
    public async searchProperty(req: any, res: express.Response, next: express.NextFunction): Promise<any> {

        try {
            // console.log("Server ", req.body);

            let queryObj = { 'query': {} };
            let querysortObj = { 'sortquery': {} };
            let total: Number = 0;

            queryObj['query']['isActive'] = true;

            queryObj['query']['isDeleted'] = false;

            // if (req.query.beds) {
            //     queryObj['query']['beds'] = req.query.beds;
            // }
            // if (req.query.baths) {
            //     queryObj['query']['baths'] = req.query.baths;
            // }
            // if (req.query.propertyType) {
            //     queryObj['query']['propertyType'] = req.query.propertyType;
            // }
            // if (req.query.minsqft) {
            //     queryObj['query']['squareFootage'] = { $gte: +req.query.minsqft, $lte: +req.query.maxsqft };
            // }
            // if (req.query.latitude && req.query.longitude) {

            //     var METERS_PER_MILE = 1609.34

            //     queryObj['query']['location'] = { $nearSphere: { $geometry: { type: 'Point', coordinates: [Number(req.query.longitude), Number(req.query.latitude)] }, $maxDistance: Number(req.query.radius) * METERS_PER_MILE } };

            // }
            //queryObj['query']['radius'] = req.query.radius;
            if (req.query.minprice) {
                queryObj['query']['price'] = { $gte: +req.query.minprice, $lte: +req.query.maxprice };
            }

            if (req.query.sortAsc) {// let querysortObj = { 'sortquery': {} };

                //1 is for ascending order and -1 is for descending order. 
                querysortObj['sortquery']['price'] = 1;

            }

            if (req.query.sortDsc) {// let querysortObj = { 'sortquery': {} };

                //1 is for ascending order and -1 is for descending order. 
                querysortObj['sortquery']['price'] = -1;

            }
            let favUsers: any = [];

            if (Number(req.query.page) == 1) {

                if (req.headers.authorization) {

                    var decoded = jwt.verify(req.headers.authorization, config.envConfig.JWT_SECRET);
                    favUsers = await PropertyModel.find({ favouriteUsers: { $elemMatch: { $eq: decoded.id } } }, { _id: 1 });

                }

                total = await PropertyModel.count(queryObj['query']);

            }

            let properties = await PropertyModel.find(queryObj['query']).limit(Number(req.query.perPage)).skip(Number(req.query.perPage) * (Number(req.query.page) - 1))//.sort({"estimatedValue":-1})
                .sort(querysortObj['sortquery']);


            return res.status(200).json({ total, properties });

        } catch (e) {
            console.log(e.message);

            return res.status(500).json({ "message": Messages.ERROR_500, e })
        }

    }



  

}

export default new PropertyController();