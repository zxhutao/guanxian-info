/**
 * 招聘相关 API
 */
import { get, post, del } from '@/utils/request'

/**
 * 获取职位列表
 * @param {object} params - 查询参数
 */
export const getJobList = (params = {}) => {
  return get('/jobs', params)
}

/**
 * 获取职位详情
 * @param {string} id - 职位ID
 */
export const getJobDetail = (id) => {
  return get(`/jobs/${id}`)
}

/**
 * 获取热门职位
 * @param {number} limit - 数量
 */
export const getHotJobs = (limit = 10) => {
  return get('/jobs/hot', { limit })
}

/**
 * 发布职位
 * @param {object} data - 职位数据
 */
export const publishJob = (data) => {
  return post('/jobs', data)
}

/**
 * 更新职位
 * @param {string} id - 职位ID
 * @param {object} data - 职位数据
 */
export const updateJob = (id, data) => {
  return put(`/jobs/${id}`, data)
}

/**
 * 删除职位
 * @param {string} id - 职位ID
 */
export const deleteJob = (id) => {
  return del(`/jobs/${id}`)
}

/**
 * 投递简历
 * @param {string} jobId - 职位ID
 * @param {object} data - 简历数据
 */
export const applyJob = (jobId, data) => {
  return post(`/jobs/${jobId}/apply`, data)
}

/**
 * 获取我投递的简历
 */
export const getMyApplications = () => {
  return get('/jobs/applications')
}

/**
 * 获取企业收到的简历
 * @param {string} jobId - 职位ID
 */
export const getJobApplications = (jobId) => {
  return get(`/jobs/${jobId}/applications`)
}

/**
 * 获取职位分类
 */
export const getJobCategories = () => {
  return get('/jobs/categories')
}

export default {
  getJobList,
  getJobDetail,
  getHotJobs,
  publishJob,
  updateJob,
  deleteJob,
  applyJob,
  getMyApplications,
  getJobApplications,
  getJobCategories
}
