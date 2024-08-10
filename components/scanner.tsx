import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { Button } from "./ui/button";
import { Flashlight, FlashlightIcon, FlashlightOff, FlashlightOffIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScannerProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  onValueChange: (value: string) => void;
}

export const Scanner: React.FC<ScannerProps> = ({
  isOpen,
  onClose,
  loading,
  onValueChange
}) => {
  const scanner = useRef<QrScanner>();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(true);

  const onScanSuccess = (result: QrScanner.ScanResult) => {
    onValueChange(result.data);
    onClose();
  };

  const onScanFail = (err: string | Error) => {
    console.log(err);
  };

  useEffect(() => {
    if (isOpen && videoEl.current) {
      // create new instance of scanner only if not present.
      if (!scanner.current) {
        scanner.current = new QrScanner(videoEl.current, onScanSuccess, {
          onDecodeError: onScanFail,
          preferredCamera: "environment",
          highlightScanRegion: true,
          highlightCodeOutline: true,
          overlay: qrBoxEl.current || undefined,
        });
      }

      scanner.current
        .start()
        .then(() => {setQrOn(true);})
        .catch((err) => {
          console.error(err);
          setQrOn(false);
        });
        
    } else if(!isOpen && scanner.current) {
      scanner.current.stop();
    } 
  }, [isOpen]);


  useEffect(() => {
    return () => {
      if (scanner.current) {
        scanner.current.stop();
        scanner.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and reload."
      );
  }, [qrOn]);

  return (
    <div className={cn(isOpen?"fixed top-10 left-0 flex items-center w-full h-full bg-slate-50 overflow-scroll":"invisible")}>
      <div className="absolute z-20 top-4 right-6 flex gap-4 m-2.5 px-1.5">
        {(isOpen && scanner.current?.hasFlash()) && 
          <Button className={"rounded-full opacity-80 hover:opacity-100"} onClick={()=>{scanner.current?.hasFlash()?scanner.current.toggleFlash():""}} variant={"outline"}>
            {(scanner.current.isFlashOn()) 
                ? <FlashlightIcon className="h-6 w-6 p-0 opacity-100"/>
                : <FlashlightOffIcon className="h-6 w-6 p-0 opacity-100"/>      
              }
          </Button>
        }
        {isOpen && <Button className="rounded-full opacity-80 hover:opacity-100" onClick={onClose} variant={"outline"}><X  className="h-6 w-6 p-0 opacity-100"/></Button>}
      </div>
      <div className="md:p-5">
        <video className="md:rounded-3xl" ref={videoEl}></video>
        <div ref={qrBoxEl} className={cn(isOpen?"border-4 border-opacity-25 rounded-2xl scanner-outline":"")}></div>
      </div>
    </div>
  );
};