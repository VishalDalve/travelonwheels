import PropertyController from '../controllers/propertyController';
import { propertyupload, profileUpload} from '../service/fileUpload';
import { Auth } from '../config/authMiddleware';
import { Router } from 'express';
/**
 * @class UserRouter
 */
export default class UserRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public routes(): void {
       
        this.router.put('/update', [Auth, propertyupload.array('files')], PropertyController.update);
        this.router.post('/addproperty', [Auth, propertyupload.array('files')], PropertyController.addproperty); 
        this.router.put('/deleteproperty', Auth, PropertyController.deleteProperty);
        //api for search propety by name --------
        this.router.get('/searchproperty', PropertyController.searchProperty);
    }
}
