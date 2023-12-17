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
    register(photo) { //Reste quelques test à faire
        if (this.repository != null) {
            photo.Date = utilities.nowInSeconds();//à voir pour mettre la date
            let newPhoto = this.repository.add(photo);
            if (this.repository.model.state.isValid) {
                this.HttpContext.response.created(newPhoto);
            } else {
                if (this.repository.model.state.inConflict)
                    this.HttpContext.response.conflict(this.repository.model.state.errors);
                else
                    this.HttpContext.response.badRequest(this.repository.model.state.errors);
            }
        } else
            this.HttpContext.response.notImplemented();
    }

    modify(photo){ // photo ou id?
            if (this.repository != null) {
                photo.Date = utilities.nowInSeconds();//Modifier date création?
                let photoId = this.repository.findByField("Id", user.Id);
                if (photoId != null) {
                    let updatedPhoto = this.repository.update(photo.Id, photo);
                    if (this.repository.model.state.isValid) {
                        this.HttpContext.response.updated(updatedPhoto);
                    }
                    else {
                        if (this.repository.model.state.inConflict)
                            this.HttpContext.response.conflict(this.repository.model.state.errors);
                        else
                            this.HttpContext.response.badRequest(this.repository.model.state.errors);
                    }
                } else
                    this.HttpContext.response.notFound();
            } else
                this.HttpContext.response.notImplemented();       
    }

    remove(id) { // warning! this is not an API endpoint
        if (Authorizations.writeGranted(this.HttpContext, Authorizations.user())) {
            super.remove(id);
        }
    }
}