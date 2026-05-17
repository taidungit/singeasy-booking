import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Phone, Mail, MapPin, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Contact = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!formData.name || !formData.email || !formData.message) {
    return toast.error("Please fill in all required fields (*)");
  }

  // Gom thông tin từ Form thành nội dung email
  const emailTo = "support@singeasy.com"; // Thay bằng email thật của bạn nếu muốn test
  const subject = encodeURIComponent(formData.subject || "SingEasy Customer Contact");
  const body = encodeURIComponent(
    `Hi SingEasy Team,\n\n` +
    `My name is: ${formData.name}\n` +
    `My contact email is: ${formData.email}\n\n` +
    `Message detail:\n${formData.message}`
  );

  // Kích hoạt đường link mở app mail mặc định trên thiết bị
  window.location.href = `mailto:${emailTo}?subject=${subject}&body=${body}`;

  toast.success("Opening your mail application to complete sending...");
};

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Nút quay lại trang chủ */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")} 
          className="mb-6 -ml-2 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="mr-1 h-5 w-5" /> Back to Home
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Get in Touch
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto text-base">
            Have any questions, feedback, or need help with your karaoke booking? Drop us a message, and our team will support you instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* CỘT TRÁI: THÔNG TIN LIÊN HỆ CỦA QUÁN */}
          <div className="md:col-span-1 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" /> Contact Info
            </h2>

            {/* Thẻ Điện thoại */}
            <div className="bg-white border border-slate-200 p-5 rounded-[20px] shadow-sm flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Call Us</h3>
                <p className="text-slate-500 text-sm mt-0.5">+84 24-1234-5678</p>
                <p className="text-xs text-slate-400 mt-1">Mon - Sun: 9AM - Midnight</p>
              </div>
            </div>

            {/* Thẻ Email */}
            <div className="bg-white border border-slate-200 p-5 rounded-[20px] shadow-sm flex items-start gap-4">
              <div className="p-3 bg-amber-50 rounded-xl text-amber-600 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Email Support</h3>
                <p className="text-slate-500 text-sm mt-0.5">support@singeasy.com</p>
                <p className="text-xs text-slate-400 mt-1">Response within 24 hours</p>
              </div>
            </div>

            {/* Thẻ Địa chỉ văn phòng chính */}
            <div className="bg-white border border-slate-200 p-5 rounded-[20px] shadow-sm flex items-start gap-4">
              <div className="p-3 bg-purple-50 rounded-xl text-purple-600 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Main Office</h3>
                <p className="text-slate-500 text-sm mt-0.5">
                  Dai Co Viet Road, Hai Ba Trung District, Hanoi, Vietnam
                </p>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: BIỂU MẪU GỬI ĐƠN LIÊN HỆ */}
          <div className="md:col-span-2">
            <form 
              onSubmit={handleSubmit} 
              className="bg-white border border-slate-200 rounded-[24px] shadow-sm p-8 space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-semibold text-slate-700">Your Name *</Label>
                  <Input 
                    id="name"
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="rounded-xl h-11" 
                    placeholder="Enter your full name" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-semibold text-slate-700">Email Address *</Label>
                  <Input 
                    id="email"
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    className="rounded-xl h-11" 
                    placeholder="name@example.com" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="font-semibold text-slate-700">Subject</Label>
                <Input 
                  id="subject"
                  value={formData.subject} 
                  onChange={e => setFormData({...formData, subject: e.target.value})} 
                  className="rounded-xl h-11" 
                  placeholder="What is this regarding?" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="font-semibold text-slate-700">Message *</Label>
                <Textarea 
                  id="message"
                  required 
                  rows={5}
                  value={formData.message} 
                  onChange={e => setFormData({...formData, message: e.target.value})} 
                  className="rounded-xl resize-none" 
                  placeholder="Type your message detail here..." 
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;