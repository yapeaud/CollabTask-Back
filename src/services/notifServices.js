import prisma from "../prisma/client.js";


//Service d'ajout d'une nouvelle notification

export async function createNewNotification({userid,type,title,message,sourcetype,sourceid}){
    const notification= await prisma.notification.create({
       data:{userid,type,title,message,sourcetype,sourceid}
    });

    return notification;
}

//Service de projection des notifications d'un utilisateur

export async function getAllNotifications(userid) {
    const notifications = await prisma.notification.findMany({
        where:{userid:userid},
        select:{id:false}
    })

    return notifications;
}

//Service de suppresion de notifications

export async function deleteNotification(notificationid){
    const deleted = await prisma.notification.delete({
        where:{notificationid:notificationid}
    })

    return deleted;
}

/////Supprimer toutes les notifications

export async function deleteAllNotifications(userid){
    const deleted = await prisma.notification.deleteMany({
        where:{userid:userid}
    })

    return deleted;
}

//Service pour marquer les notifications comme lu


export async function MakeNotifAsRead(notificationid){
    const isReaded = await prisma.notification.update({
        data:{isread:true},
        where:{notificationid:notificationid}
    })

    return isReaded;
}

////Marquer  toute les notifications comme lues
export async function MakeAllNotifAsRead(){
    const isReaded = await prisma.notification.updateMany({
        data:{isread:true},
        where:{isread:false}
    })

    return isReaded;
}