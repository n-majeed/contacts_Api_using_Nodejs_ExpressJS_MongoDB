const asyncHandler=require("express-async-handler");
const  Contact =require("../models/contactModel")

// @desc Get all contacts
// @route GET /api/contacts
// @access public
const getContacts= asyncHandler( async (req,res)=>{
    const contacts= await Contact.find({user_id:req.user.id});
    res.status(200).json(contacts);
});
// @desc Create contacts
// @route POST /api/contacts
// @access public
const createContact=asyncHandler(async(req,res)=>{
    console.log("body is ", req.body)
    const {name,phone,email}=req.body;
    if(!name|| !phone || !email){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const contact= await Contact.create({
        name,
        phone,
        email,
        user_id:req.user.id
    });
    res.status(201).json(contact)
});

// @desc Get Single contacts
// @route GET /api/contacts/id
// @access public
const getContact=asyncHandler(async (req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found")
    }
    res.status(200).json(contact);
});
// @desc Update contacts
// @route PUT /api/contacts/id
// @access public
const updateContact=asyncHandler(async(req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found")
    }
    if(contact.user_id.toString()!==req.user.id){
        res.status(403);
        throw new Error("A user is not permitted to changed other user contact")
    }
const updateContact= await Contact.findByIdAndUpdate(req.params.id, req.body,{new:true})
    res.status(200).json(updateContact)
});
// @desc Delete contacts
// @route DELETE /api/contacts/id
// @access public
const deleteContact=asyncHandler(async(req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found")
    }
    if(contact.user_id.toString()!==req.user.id){
        res.status(403);
        throw new Error("A user is not permitted to delete other user contact")
    }
    await Contact.deleteOne({_id:req.params.id});
    res.status(200).json(contact);
});
module.exports={getContacts,createContact,getContact,updateContact,deleteContact};
