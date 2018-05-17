<template>
  <section class="help-ct">
    <h3>帮助：</h3>
    <h4>1. 快速接入：</h4>
    <dl class="help-step">
      <dt class="help-step-title">第一步：</dt>
      <dd class="help-step-detail">在“项目列表” -> “新建项目”，创建一个新的项目</dd>
    </dl>
    <dl class="help-step">
      <dt class="help-step-title">第二步：</dt>
      <dd class="help-step-detail"><a href="http://doc.fe.jyb.com/book/common-lib/packages/lib-tracker/" target="_blank">通过lib-tracker快速接入</a></dd>
      <dd class="help-step-detail"><a href="http://doc.fe.jyb.com/book/common-lib/packages/lib-tracker/doc/API.html" target="_blank">lib-tracker API</a></dd>
    </dl>
    <dl class="help-step">
      <dt class="help-step-title">第三步：</dt>
      <dd class="help-step-detail">使用<a href="http://doc.fe.jyb.com/book/workflow/packages/jfet-build-plugin-ftp/" target="_blank">jfet-build-plugin-ftp</a>插件上传sourcemap文件</dd>
      <dd class="help-step-detail">如果使用jfet-solution-h5act或者jfet-solution-h5product默认已经集成该插件</dd>
    </dl>
    <h4>2. 告警配置：</h4>
    <dl class="help-step">
      <dl class="help-step">
        <dt class="help-step-title">第一步：</dt>
        <dd class="help-step-detail">“项目列表” -> “告警” -> “添加规则/添加联系人”</dd>
      </dl>
      <dl class="help-step">
        <dt class="help-step-title">第二步：</dt>
        <dd class="help-step-detail">关注“腾讯企业邮箱”公众号，把邮箱与微信绑定，[教程](http://service.exmail.qq.com/cgi-bin/help?subtype=1&&id=23&&no=1000970)</dd>
      </dl>
    </dl>
    <h4>3. 进阶用法：</h4>
    <dl class="help-step">
      <dl class="help-step">
        <dt class="help-step-title">自主接入：</dt>
        <dd class="help-step-detail">接入规范待补充</dd>
      </dl>
    </dl>
  </section>
</template>

<style lang="scss">
.help-ct {
  a {
    color: #20a0ff;
  }

  .help-step {

  }

  .help-step-title {
    margin-bottom: 10px;
    font-weight: bold;
  }

  .help-step-detail {
    margin: 0;
    margin-bottom: 8px;
  }
}
</style>
