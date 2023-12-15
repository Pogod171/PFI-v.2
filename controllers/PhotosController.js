import Authorizations from '../authorizations.js';
import Repository from '../models/repository.js';
import PhotoModel from '../models/photo.js';
import PhotoLikeModel from '../models/photoLike.js';
import Controller from './Controller.js';

export default
    class Photos extends Controller {
    constructor(HttpContext) {
        super(HttpContext, new Repository(new PhotoModel()), Authorizations.user());
        this.photoLikesRepository = new Repository(new PhotoLikeModel());
    }
    index(id) {
        if (id != undefined) {
            if (Authorizations.readGranted(this.HttpContext, Authorizations.admin()))
                this.HttpContext.response.JSON(this.repository.get(id));
            else
                this.HttpContext.response.unAuthorized("Unauthorized access");
        }
        else {
            if (Authorizations.granted(this.HttpContext, Authorizations.admin()))
                this.HttpContext.response.JSON(this.repository.getAll(this.HttpContext.path.params), this.repository.ETag, true, Authorizations.admin());
            else
                this.HttpContext.response.unAuthorized("Unauthorized access");
        }
    }
    remove(id) { // warning! this is not an API endpoint
        if (Authorizations.writeGranted(this.HttpContext, Authorizations.user())) {
            super.remove(id);
        }
    }
}