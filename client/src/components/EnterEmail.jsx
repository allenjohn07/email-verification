import React, { useEffect, useRef, useState } from 'react'
import { Input } from '@nextui-org/react'
import { instance } from '../../config/axios.js'
import { Loader } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie';
import { Toast } from 'primereact/toast';
import logo from '../assets/verification.png'
import { Button, TextInput } from 'flowbite-react'


const EnterEmail = () => {
    const [mail, setMail] = useState('')
    const [loading, setLoading] = useState(false)
    const toast = useRef(null);

    const navigate = useNavigate()

    const cookies = new Cookies()

    //to set up the eventlistener and it is evoked everytime if there is a change in mail
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                // console.log("hi");
                if (loading) {
                    return
                }
                handleEmail()
            }
        }
        window.addEventListener('keypress', handleKeyPress)

        return () => {
            window.removeEventListener('keypress', handleKeyPress);
        };
    }, [mail])

    //function to handle Email
    const handleEmail = async () => {
        // console.log(mail);
        if (mail.length < 1) {
            toast.current.show({ severity: 'error', detail: 'Email is required', life: 3000 });
            return;
        }
        
        // Regular expression for validating entered email address
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (!emailPattern.test(mail)) {
            toast.current.show({ severity: 'error', detail: 'Invalid email address', life: 3000 });
            return;
        }

        try {
            setLoading(true)
            const response = await instance.post('/api/addEmail', { email: mail })
            // console.log(response.data);
            if (response.data.message === 'Email sent successfully') {
                toast.current.show({ severity: 'success', detail: `${response.data.message}`, life: 3000 });
                setMail('')
                cookies.set("email", mail)
                navigate('/verify')
                setLoading(false)
                return
            }
            toast.current.show({ severity: 'error', detail: `${response.data.message}`, life: 3000 });
            setTimeout(() => {
                setMail('')
            }, 3000);
            setLoading(false)
        } catch (error) {
            console.log(error);
            toast.current.show({ severity: 'error', detail: `${response.data.message}`, life: 3000 });
            setLoading(false)
        }
    }


    return (
        <div className='flex flex-col gap-10 items-center justify-center h-screen p-10 '>
            <div className='absolute lg:top-10 lg:left-10 top-5 left-5 font-semibold font-mono flex items-center gap-1'>
                <img className='w-6' src={logo} alt="logo" />
                Email verification.
            </div>
            <Toast className='w-[300px] lg:w-[300px]' ref={toast} position="bottom-right" />
            <h1 className={loading ? 'hidden' : "font-bold text-base lg:text-xl mb-2"}>Enter your email to continue.</h1>
            {
                loading ?
                    <div className="flex items-center space-x-2">
                        <Loader className="animate-spin" />
                        <span className='font-semibold text-gray-700'>Email is on your way...</span>
                    </div>
                    :
                    <div className='flex flex-col sm:flex-row items-center justify-center gap-3'>
                        <TextInput className='w-[300px]' value={mail} onChange={(e) => setMail(e.target.value)} id="email1" type="email" placeholder="example@gmail.com" required />
                        <Button onClick={handleEmail} gradientDuoTone="tealToLime">Enter</Button>
                    </div>
            }
        </div>
    )
}

export default EnterEmail