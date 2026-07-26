import QRCode from "react-qr-code";

interface CertificateQRProps {
  certificateId: string;
}

export function CertificateQR({ certificateId }: CertificateQRProps) {
  const verifyUrl = `https://mwarex.in/verify/${certificateId}`;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl max-w-xs mx-auto border border-gray-100 shadow-sm">
      <QRCode
        value={verifyUrl}
        size={200}
        level="H"
        bgColor="#ffffff"
        fgColor="#000000"
      />
      <div className="mt-4 text-center">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Certificate ID</p>
        <p className="text-black font-mono font-medium">{certificateId}</p>
        <p className="text-gray-400 text-[10px] mt-2">Scan to Verify</p>
      </div>
    </div>
  );
}
