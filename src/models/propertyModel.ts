import { Schema, Document } from 'mongoose';


import * as connections from '../config/connection';
// import { Role, Passport, DrivingLicense, BankDetails, TwoFactor } from '../interfaces/userInterface';
import { Role } from '../interfaces/userInterface';

export interface IPropertyModel extends Document {

    title: string,
    images: Array<string>,
    category:string,
    description: string,
    overview: string,
    itinerary: string,
    inclusions: string,
    exclusions: string,
    extras: string,
    price: number,
    isActive: Boolean,
    isVerified: Boolean,
    createdAt: Date,
    updatedAt: Date
    isDeleted: Boolean,

}

const PropertySchema: Schema = new Schema({

    title: {
        type: String
    },
    images: [],

    description: {
        type: String
    },
    category: {
        type: String
    },
    price: {
        type: Number
    },
    overview: {
        type: String
    }, itinerary: {
        type: String
    }, inclusions: {
        type: String
    }, exclusions: {
        type: String
    }, extras: {
        type: String
    },
    isActive: Boolean,
    isVerified: Boolean,
    isDeleted: Boolean,
    createdAt: Date,
    createdBy: {
        type: String
    },
    updatedAt: Date

}, {
    collection: 'property',
    versionKey: false
}).pre('save', function <IPropertyModel>(next) {
    if (this) {
        const now: Date = new Date();
        if (!this.createdAt) {
            this.createdAt = now;
        }
        this.updatedAt = now;
        this.isActive = true;
        this.isVerified = true;
        this.isDeleted = false;

    }
    next();
}).pre('updateOne', function <IPropertyModel>(next) {
    if (this) {
        this.getUpdate().updatedAt = new Date();
    }
    next();
});

//   PropertySchema.methods.findBids = function (cb) {
//     return this.model('Animal').find({ type: this.type }, cb);
//   };

export default connections.db.model<IPropertyModel>('PropertyModel', PropertySchema);
