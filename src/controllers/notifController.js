import * as notifService from "../services/notifServices.js";



//Controlleur de creation de notifications

export async function create(req, res, next) {
    
    try {
        const {userid,type,title,message,sourcetype,sourceid}=req.body;

        if( !userid || !type || !title || !message){
            return res.status(400).json({success:false,message:"Champs requis manquants"});
        }

        const notification = await notifService.createNewNotification({ userid, type, title, message, sourcetype, sourceid})
        return res.status(201).json({message:" Notification crée",notification})
    } catch (error) {
        next(error);
    }
}


//Controlleur de recuperation des notifications d'un utilisateur
export async function retrieves(req,res,next){
    try {
        const userid=req.query.userid;
        console.log(userid)
        if(!userid)return res.status(400).json({success:"false",message:"Identifiant requis"});

        const notifications= await notifService.getAllNotifications(userid);
        if(notifications.length){
            return res.status(200).json({success:true,notifications})
        }else{
            return res.status(202).json({success:true,message:"Aucune notification pour le moment",notifications})
        }
    } catch (error) {
        next(error)
    }
}

//controlleur pour marquer une notification comme lu
 export async function setRead(req,res,next) {
    try {
        const notificationid=req.query.notificationid;
        if(!notificationid)return res.status(400).json({success:false,message:"Identifiant requis !"});
        const isReaded = await notifService.MakeNotifAsRead(notificationid);
        return res.status(200).json({success:true,message:"marquer comme lu!",isReaded});
    } catch (error) {
        next(error);
    }
 }

 //Controlleur pour marquer toute les notifications comme lu
 export async function setAllAsRead(req,res,next) {
     try {
        const userid=req.query.userid;
        if(!userid)return res.status(400).json({success:false,message:"Identifiant requis"});

        const allIsRead= await notifService.MakeAllNotifAsRead(userid);
        return res.status(200).json({success:true,message:"toute les notifications ont été marquées comme lues!",allIsRead});
     } catch (error) {
        next(error);
     }
 }

 //controlleur pour supprimer une notification
 export async function remove(req,res,next) {
    try {
        const notificationid=req.query.notificationid;
        if(!notificationid)return res.status(400).json({success:true,message:"Identifiant requis"});

        const isremove = await notifService.deleteNotification(notificationid);
        return res.status(200).json({success:true,message:"supprimé avec succès!",isremove});
    } catch (error) {
        next(error)
    }
    
 }
 //controlleur pour supprimer toute les  notifications d'un utilisateur
 export async function removeAll(req,res,next) {
    try {
        const userid=req.query.userid;
        if(!userid)return res.status(400).json({success:true,message:"Identifiant requis"});

        const isremove = await notifService.deleteAllNotifications(userid);
        return res.status(200).json({success:true,message:" toutes les notifications ont été supprimé avec succès!",isremove});
    } catch (error) {
        next(error)
    }
    
 }

