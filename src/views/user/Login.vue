<template>
  <a-form class="login-form" :form="form" @submit="handleSubmit">
    <a-form-item>
      <a-input
        type="text"
        size="large"
        v-decorator="[
          'username',
          { rules: [{ required: true, message: '请输入帐户名或邮箱地址' }] }
        ]"
        placeholder="账户: admin"
      >
        <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)"/>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input
        type="password"
        size="large"
        v-decorator="[
          'password',
          { rules: [{ required: true, message: '请输入您的密码！' }] }
        ]"
        placeholder="密码: admin or ant.design"
      >
        <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-checkbox
        v-decorator="[
          'remember',
          { valuePropName: 'checked', initialValue: true }
        ]"
      >
        自动登录
      </a-checkbox>
      <a-button class="login-form-button" type="primary" size="large" html-type="submit">
        登录
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import md5 from 'md5'
import { Login } from '@/api/login'
export default {
  name: 'UserLogin',
  data () {
    return {
      form: this.$form.createForm(this, { name: 'normal_login' })
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields }
      } = this

      validateFields((err, values) => {
        if (!err) {
          const loginParams = { ...values }
          loginParams.password = md5(values.password)

          Login(loginParams)
            .then(res => this.loginSuccess(res))
            .catch(err => this.requestFailed(err))
        }
      })
    },
    loginSuccess (res) {
      console.log(res)
    },
    requestFailed (err) {
      this.isLoginError = true
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
    }
  }
}
</script>

<style lang="less">
  .login-form {
    margin-left: auto;
    margin-right: auto;
    width: 368px;

    .login-form-forgot { float: right; }
    .login-form-button { width: 100%; }
    .ant-input { background-color: #fff; }
  }
</style>
