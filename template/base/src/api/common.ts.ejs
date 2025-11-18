import { http } from 'cosey';
import { type AxiosRequestConfig } from 'axios';

interface UploadResponseData {
  list: {
    file_url: string;
  }[];
}

const upload = (
  data: Blob,
  config?: AxiosRequestConfig & {
    file_type?: string;
  },
) => {
  const formData = new FormData();
  formData.append('file', data);
  formData.append('module', 'public');
  formData.append('file_type', config?.file_type || 'image');

  return http.post<UploadResponseData>('/upload', formData, {
    timeout: 0,
    ...config,
  });
};

export default {
  /**
   * 统一上传接口
   */
  upload,

  /**
   * 发送一个 Blob 对象，返回对应的 url
   */
  singleUpload: async (data: Blob, config?: AxiosRequestConfig) => {
    const responseData = await upload(data, config);

    return responseData.list[0].file_url;
  },
};
