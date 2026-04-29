import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image, X, Loader2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useFeedStore } from '../../stores/feedStore';
import { uploadImageToSmMs } from '../../services/imageUpload';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { publishPost, isLoading } = useFeedStore();
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);  // 本地预览 URL
  const [uploadingImages, setUploadingImages] = useState([]);  // 正在上传的文件
  const [uploadedUrls, setUploadedUrls] = useState([]);  // 上传后的图床 URL
  const [location, setLocation] = useState('');  // 位置信息

  // 处理图片选择 - 上传到 sm.ms
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 9) {
      toast.error('最多只能上传9张图片');
      return;
    }

    // 添加到预览列表
    const newPreviewImages = files.map(file => URL.createObjectURL(file));
    setImages([...images, ...newPreviewImages]);

    // 上传到 sm.ms
    for (const file of files) {
      // 添加到上传中列表
      const uploadingId = Date.now() + Math.random();
      setUploadingImages(prev => [...prev, { id: uploadingId, file }]);

      try {
        // 上传到 sm.ms
        const result = await uploadImageToSmMs(file);
        setUploadedUrls(prev => [...prev, result.url]);
        toast.success(`${file.name} 上传成功`);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`${file.name} 上传失败`);
      } finally {
        // 从上传中列表移除
        setUploadingImages(prev => prev.filter(item => item.id !== uploadingId));
      }
    }
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(images[index]);
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    // 同步移除已上传的 URL
    const newUrls = uploadedUrls.filter((_, i) => i < newImages.length);
    setUploadedUrls(newUrls);
  };

  const handleSubmit = async () => {
    if (!content.trim() && uploadedUrls.length === 0) {
      toast.error('请输入内容或上传图片');
      return;
    }

    if (uploadingImages.length > 0) {
      toast.error('图片正在上传中，请稍候');
      return;
    }

    try {
      await publishPost({
        content,
        mediaUrls: uploadedUrls,
        location: location || null
      });
      toast.success('发布成功');
      navigate(-1);
    } catch (error) {
      toast.error(error.message || '发布失败');
    }
  };

  // 获取当前位置
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('浏览器不支持定位功能');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // 实际项目中应该调用地图 API 获取地址
        setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
        toast.success('已获取位置');
      },
      (error) => {
        toast.error('获取位置失败');
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 py-3 flex items-center justify-between border-b">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="font-medium">发布动态</span>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-4 py-1.5 bg-primary-500 text-white rounded-full text-sm font-medium disabled:opacity-50"
        >
          {isLoading ? '发布中...' : '发布'}
        </button>
      </div>

      {/* Content Input */}
      <div className="flex-1 p-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="分享你的想法..."
          className="w-full h-48 resize-none border-0 bg-transparent text-base focus:outline-none"
          maxLength={1000}
        />

        {/* Location Input */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={handleGetLocation}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-gray-200"
          >
            <MapPin className="w-4 h-4" />
            {location ? '更新位置' : '添加位置'}
          </button>
          {location && (
            <span className="text-sm text-gray-500">{location}</span>
          )}
        </div>
      </div>

      {/* Image Upload */}
      <div className="px-4 pb-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {images.map((url, index) => (
            <div key={index} className="relative flex-shrink-0">
              <img src={url} alt="" className="w-20 h-20 object-cover rounded-lg" />
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {/* Upload in progress indicators */}
          {uploadingImages.map((item) => (
            <div key={item.id} className="relative flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
          ))}
          {images.length + uploadingImages.length < 9 && (
            <label className="flex-shrink-0 w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary-500">
              <Image className="w-8 h-8 text-gray-400" />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>
        {uploadedUrls.length > 0 && (
          <p className="text-xs text-green-500 mt-1">✓ {uploadedUrls.length} 张图片已上传到图床</p>
        )}
      </div>
    </div>
  );
};

export default CreatePostPage;