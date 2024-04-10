"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [timeStarted, setTime] = useState<Date | null>(null);

  const [estimatedTime, setEstimatedTime] = useState<number|undefined>(undefined)
  const [uploadSpeed, setUploadSpeed] = useState<string|null>("0 kb/s")

  const unitTransition = (spd : number) => {
    if((spd/1024)/1024 < 1){
      return `${(spd/1024).toFixed(2)}Kb/s`
    }
    return `${((spd/1024)/1024).toFixed(2)}Mb/s`
  }

  const axiosInstance = axios.create({
    baseURL: "https://v2.convertapi.com/upload",
    onUploadProgress: (progressEvent) => {
      if (
        timeStarted &&
        progressEvent.estimated
      ) {
        let timeElapsed = new Date().getTime() - timeStarted.getTime();
        // console.log(timeElapsed, "calculated time");
        // let uploadSpeed = (progressEvent.loaded)/ (timeElapsed/1000);
        // let estimatedTime = (progressEvent.total - progressEvent.loaded) / uploadSpeed
        // console.log(uploadSpeed, "calculated upload speed");
        // console.log(estimatedTime, "calculated estimated time");
        // console.log(progressEvent.estimated, "")
        let x = progressEvent.loaded / (timeElapsed/1000);
        setUploadSpeed(unitTransition(x));
        setEstimatedTime(Math.round(progressEvent.estimated));
        if(progressEvent.estimated <= 1 && x !== 0){
          setEstimatedTime(0)
        }
      }
    },
  });

  // var userImageLink =
  //   "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20200714180638/CIP_Launch-banner.png";
  // var time_start: any, end_time: any;

  // // The size in bytes
  // var downloadSize = 5616998;
  // var downloadImgSrc = new Image();

  // downloadImgSrc.onload = function () {
  //   end_time = new Date().getTime();
  //   displaySpeed();
  // };
  // time_start = new Date().getTime();
  // downloadImgSrc.src = userImageLink;
  // document.write("time start: " + time_start);
  // document.write("<br>");

  // function displaySpeed() {
  //   var timeDuration = (end_time - time_start) / 1000;
  //   var loadedBits = downloadSize;

  //   /* Converts a number into string 
  //                    using toFixed(2) rounding to 2 */
  //   var bps = Number((loadedBits / timeDuration).toFixed(2));
  //   var speedInKbps = Number((bps / 1024).toFixed(2));
  //   var speedInMbps = (speedInKbps / 1024).toFixed(2);
  //   alert(
  //     "Your internet connection speed is: \n" +
  //       bps +
  //       " bps\n" +
  //       speedInKbps +
  //       " kbps\n" +
  //       speedInMbps +
  //       " Mbps\n"
  //   );
  // }

  useEffect(() => {
    if (timeStarted && file) {
      axiosInstance.post("/", file);
    }
  }, [timeStarted]);

  const uploadHandler = () => {
    setTime(new Date());
  };

  const fileHandler = (e: any) => {
    setFile(e.target.files[0]);
  };

  // console.log(speed, "speed");

  return (
    <div>
      <input type="file" onChange={fileHandler} />
      <button onClick={uploadHandler}>Upload</button>
      <p>{`Estimated Time : ${estimatedTime}`}</p>
      <p>{`upload speed : ${uploadSpeed}`}</p>
    </div>
  );
}
