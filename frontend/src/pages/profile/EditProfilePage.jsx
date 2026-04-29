import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import Avatar from '../../components/common/Avatar';
import { Camera, ChevronLeft, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const { uploadAvatar, updateProfile, isLoading } = useUserStore();

  const [nickname, setNickname] = useState(user?.nickname || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [gender, setGender] = useState(user?.gender ?? 0);
  const [birthday, setBirthday] = useState(user?.birthday || '');
  const [city, setCity] = useState(user?.city || '');
  const [tags, setTags] = useState(user?.tags?.join(', ') || '');

  const handleSave = async () => {
    if (!nickname.trim()) {
      toast.error('请输入昵称');
      return;
    }

    try {
      const profileData = {
        nickname: nickname.trim(),
        bio: bio.trim(),
        gender,
        birthday,
        city,
      };

      const updatedProfile = await updateProfile(profileData);

      // 使用 API 返回的完整用户信息更新本地存储
      if (updatedProfile) {
        updateUser(updatedProfile);
      } else {
        // 如果 API 没有返回完整数据，手动更新
        updateUser({
          nickname: nickname.trim(),
          bio: bio.trim(),
          gender,
          birthday,
          city,
        });
      }

      toast.success('保存成功');
      navigate(-1);
    } catch (error) {
      toast.error('保存失败');
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const avatarUrl = await uploadAvatar(file);
      updateUser({ avatar: avatarUrl });
      toast.success('头像已更新');
    } catch (error) {
      toast.error('上传失败');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">编辑资料</h1>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="text-primary-500 font-medium hover:text-primary-600 disabled:opacity-50"
          >
            {isLoading ? '保存中...' : '保存'}
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <Avatar
              src={user?.avatar}
              name={user?.nickname}
              size="2xl"
              className="border-4 border-white shadow-lg"
            />
            <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors shadow-lg">
              <Camera className="w-5 h-5 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-3">点击更换头像</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Nickname */}
          <FormItem label="昵称">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="输入昵称"
              maxLength={20}
            />
          </FormItem>

          {/* Bio */}
          <FormItem label="个人简介">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="介绍一下自己..."
              rows={4}
              maxLength={200}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{bio.length}/200</p>
          </FormItem>

          {/* Gender */}
          <FormItem label="性别">
            <div className="flex gap-3">
              <button
                key={1}
                onClick={() => setGender(1)}
                className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                  gender === 1
                    ? 'bg-primary-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-300'
                }`}
              >
                男
              </button>
              <button
                key={2}
                onClick={() => setGender(2)}
                className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                  gender === 2
                    ? 'bg-primary-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-300'
                }`}
              >
                女
              </button>
            </div>
          </FormItem>

          {/* Birthday */}
          <FormItem label="生日">
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </FormItem>

          {/* City */}
          <FormItem label="城市">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="所在城市"
            />
          </FormItem>

          {/* Tags */}
          <FormItem label="兴趣标签">
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="用逗号分隔，如：旅行,音乐,美食"
            />
            <p className="text-xs text-gray-400 mt-1">添加标签帮助他人了解你</p>
          </FormItem>
        </div>
      </div>
    </div>
  );
};

const FormItem = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    {children}
  </div>
);

export default EditProfilePage;