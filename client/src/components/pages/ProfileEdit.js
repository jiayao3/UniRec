import styles from './Modules/Profile.module.css';
import React,{useState, useEffect, useCallback } from 'react'
import axios from "axios";
//import { useNavigate } from "react-router-dom"

function ProfileEdit() {
    const [newDisplayName, setNewDisplayName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState("")
    const [err, setErr] = useState(false);
    const [newBio, setNewBio] = useState('');
    const [image,setImage] = useState("");
    const [url, setUrl] = useState(undefined);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [user, setUser] = useState("")



    const uploadFields = useCallback(() => {
        setLoading(true);
        const configuration = {
          method: "post",
          url: `http://localhost:3001/user/edit-profile/${JSON.parse(localStorage.getItem("User")).email}`,
          data: {
            newDisplayName,
            newPassword,
            newBio,
            pic:url
          },
        };
    
        // make the API call
        axios(configuration)
        .then((result) => {
            setLoading(false);
            setSuccess(true);
        })
        .catch((error) => {
          error = new Error();
        });
        window.open("/profile");
      }, [newDisplayName, newPassword, newBio, url])
    
      useEffect(() => {
        if(url){
            uploadFields()
        }
    
        if (newPassword === confirmPassword) {
          setErr(false);
        } else {
          setErr(true);
        }
        const user = JSON.parse(localStorage.getItem('User'));
        axios.get(`http://localhost:3001/user/getprofile/${user.email}`)
        .then(res => {
            setUser(res.data);
        }).catch(
            (err) => console.log("err", err)
        );
      }, [setUser, confirmPassword, newPassword, url, uploadFields])
    
      const uploadPic = ()=>{
          const data = new FormData()
          data.append("file",image)
          data.append("upload_preset","profile_image_upload")
          data.append("cloud_name","dm13bguzr")
          fetch("https://api.cloudinary.com/v1_1/dm13bguzr/image/upload", {
              method:"post",
              body:data
          })
          .then(res=>res.json())
          .then(data=>{
             setUrl(data.url)
          })
          .catch(err=>{
              console.log(err)
          })
      }
      
      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!err) {
            if(image){
                uploadPic()
            }else{
                uploadFields()
            }
        } else {
            alert("Passwords Not Matching")
        }
      }

      const previewImage = async (e) => {
        setImage(e.target.files[0])
        setPreview(URL.createObjectURL(e.target.files[0]))
      }

    return (
        <>
            <h1 style = {{color: "#607EAA"}}>Profile</h1>
            <div className={styles.card}>
            <img style = {{width : "8rem", height : "10rem", marginRight:"2rem", objectFit: "cover"}} src={user.data?.pic} alt = "profile_pic"></img>
                <form onSubmit={handleSubmit} style = {{width: "100%", display: "flex", flexDirection: "column"}}>
                    <div style = {{display: "flex"}}>
                        <p style = {{width: "25%"}}>Display Name:</p>
                        <input style = {{width: "60%"}} 
                        type="text" 
                        placeholder={user.data?.displayName}
                        onChange={(e) => setNewDisplayName(e.target.value)}
                        />
                    </div>
                    <div style = {{display: "flex"}}>
                        <p style = {{width: "25%"}}>New Password:</p>
                        <input style = {{width: "60%"}} 
                        type="password" 
                        placeholder='New Password' 
                        onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div style = {{display: "flex"}}>
                        <p style = {{width: "25%"}}>New Password:</p>
                        <div style = {{display: "flex", flexDirection: "column", width: "60%"}}>
                            <input style = {{width: "100%"}} 
                            type="password" 
                            placeholder='Confirm Password' 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {err ? <p style = {{fontSize:"0.8rem", color:"grey"}}> Passwords did not match </p> : ''}
                        </div>
                        
                        
                    </div>
                    
                    <hr style = {{marginLeft: "0", marginRight: "0"}}/>
                    <div style = {{display: "flex"}}>
                        <p style = {{width: "25%"}}>Bio:</p>
                        <textarea style = {{width: "60%", height:"4rem"}} 
                        type="text" 
                        placeholder={user.data?.bio}
                        onChange={(e) => setNewBio(e.target.value)}
                        />
                    </div>
                    <div style = {{display: "flex", marginTop: "1rem"}}>
                        <p style = {{width: "25%"}}>Image:</p>
                        <input style = {{border: "none"}} type="file" onChange={previewImage} />
                        {
                            preview ? (
                                <img src = {preview} alt = "upload"></img>
                            ) : (
                                <></>
                            )
                        }
                    </div>
                    <button type = "submit" style = {{marginTop: "auto", alignSelf: "flex-end"}}>Save</button>
                    <div style = {{textAlign : "center"}}>
                    {
                        loading? (
                            <p>loading</p>
                        ): (
                            success ? (
                                <p>Save Complete</p>
                            ) : (
                                <p></p>
                            )
                        )
                    }
                    </div>
                </form>
            </div>

        </>
    )
}

export default ProfileEdit;