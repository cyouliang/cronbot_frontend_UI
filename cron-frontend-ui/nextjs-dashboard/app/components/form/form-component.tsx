'use client';

import { Button, Paper, Typography } from "@mui/material";
import CustomTextField from "../customTextField/custom-text-field";
import styles from '@/app/ui/home.module.css';
import { useRef, useState } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import Datetime from 'react-datetime';
import { PickerChangeHandlerContext, DateValidationError } from "@mui/x-date-pickers/models";

let url = '';

if(process.env.NODE_ENV !== 'production') {
    url = 'http://localhost:3000';
} else {
    url = 'https://cronbot-app.vercel.app';
}

type Values = {
    name: string,
    username: string,
    email: string,
    date: Date,
}
export default function Form() {

    const [values,setValues] = useState<Values>({
        name: "",
        username: "",
        email: "",
        date: new Date(),
    });
    
    const handleChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        setValues({...values,[event.target.name] : event.target.value});
    }

    const handleSubmit = async (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            let res = await fetch(`${url}/api/createSchedule`, {
                method: "POST",
                body: JSON.stringify({
                    name: values.name,
                    username: values.username,
                    email: values.email,
                    date: values.date
                }),
            });
            res = await res.json();

            console.log("res is: ", res);
            if (res.status == 200) {
                alert("Schedule created successfully!");
                setValues(
                    {
                        name: "",
                        username: "",
                        email: "",
                        date: new Date(),
                    }
                );
                ref.current?.reset();
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                // Handle errors of type Error or its subclasses
                console.error("Error:", error.message);
                alert("Error occurred: " + error.message);
            } else {
                // Handle other types of errors
                console.error("Unknown Error:", error);
                alert("Unknown Error occurred");
            }
        }
    }

    const handleDateChange = (val: any, event: any) => {
        console.log("val is: ", JSON.stringify(val));
        console.log("event is: ", JSON.stringify(event));
        setValues({...values, date: val});
    }

    const ref = useRef<HTMLFormElement>(null)

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Paper className={styles.paperContainer}>
                <form ref={ref} onSubmit={(e) => handleSubmit(e)} className={styles.form}>
                    <CustomTextField  changeHandler={handleChange} label={"Name"} name={"name"}/>
                    <CustomTextField  changeHandler={handleChange} label={"Username"} name={"username"}/>
                    <CustomTextField  changeHandler={handleChange} label={"Email"} name={"email"}/>
                    <DatePicker onChange={(val, event)=> handleDateChange(val, event)} defaultValue={dayjs(new Date())}/>
                    <div className={styles.btmContainer}>
                        <Button className={styles.btnContainer}>Cancel</Button>
                        <Button type={"submit"} className={styles.btnContainer}>Submit</Button>
                    </div>
                </form>
            </Paper>
        </LocalizationProvider>
    )

}