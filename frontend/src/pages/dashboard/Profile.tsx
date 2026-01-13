import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Save, Shield } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";

const Profile = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">الملف الشخصي</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={isEditing ? "btn-outline" : "btn-primary"}
        >
          {isEditing ? "إلغاء" : "تعديل"}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-primary-600 font-bold text-2xl">
              {user?.firstName?.charAt(0)}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم الأول
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  disabled={!isEditing}
                  className="input-field pr-10 disabled:bg-gray-50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم الأخير
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                disabled={!isEditing}
                className="input-field disabled:bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={!isEditing}
                className="input-field pr-10 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رقم الهاتف
            </label>
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={!isEditing}
                dir="ltr"
                className="input-field pr-10 disabled:bg-gray-50"
              />
            </div>
          </div>

          {isEditing && (
            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              حفظ التغييرات
            </button>
          )}
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          الأمان
        </h3>
        <button className="btn-outline w-full">تغيير كلمة المرور</button>
      </motion.div>
    </div>
  );
};

export default Profile;
