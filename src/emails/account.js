const sgMail=require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:"pratikjadhao1965@gmail.com",
        subject:"we welcome you",
        text:`welcome to our task manager app ,let us know if u want anything "${name}"`
    }).then((res) => console.log(res)) 
    .catch((e) => console.log(e))
}

const sendCancelationEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:"pratikjadhao1965@gmail.com",
        subject:"account deleted",
        text:`your account is deleted,${name}.is there anything we could have done for you?`
    }).then((res)=>console.log(res))
    .catch((e)=>console.log(e))
}
module.exports={
    sendWelcomeEmail,
    sendCancelationEmail
}
