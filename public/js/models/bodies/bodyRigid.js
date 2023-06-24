import * as THREE from "three";
import * as AMMO from "ammo";

export class RigidBody{
    constructor(name){
        this.name = name;
    }
    createBox(mass,pos,quat,size){
        this.transform_ = new AMMO.btTransform();
        this.transform_.setIdentity();
        this.transform_.setOrigin(new AMMO.btVector3(pos.x,pos.y,pos.z));
        this.transform_.setRotation(new AMMO.btQuaternion(quat.x,quat.y,quat.z,quat.w));
        this.motionState_ = new AMMO.btDefaultMotionState(this.transform_);

        const btSize = new AMMO.btVector3(size.x * 0.5, size.y * 0.5, size.z * 0.5);
        this.shape_ = new AMMO.btBoxShape(btSize);
        this.shape_.setMargin(0.05);

        this.inertia_ = new AMMO.btVector3(0,0,0);
        if(mass > 0){
            this.shape_.calculateLocalInertia(mass, this.inertia_);
        }

        this.info_ = new AMMO.btRigidBodyConstructionInfo(
            mass,
            this.motionState_,
            this.shape_,
            this.inertia_
        );
        this.body_ = new AMMO.btRigidBody(this.info_)
    }
}
