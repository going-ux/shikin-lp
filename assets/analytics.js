(() => {
  const config = window.LP_CONFIG || {};
  let businessType = 'individual', expanded = false;
  window.dataLayer = window.dataLayer || [];
  const gaEnabled = /^G-[A-Z0-9]+$/.test(config.measurementId || '');
  function gtag(){ window.dataLayer.push(arguments); }
  if (gaEnabled) {
    gtag('js', new Date());
    gtag('config', config.measurementId, {send_page_view:false, allow_google_signals:false, allow_ad_personalization_signals:false});
    const script = document.createElement('script');
    script.async = true; script.src = 'https://www.googletagmanager.com/gtag/js?id=' + config.measurementId;
    document.head.appendChild(script);
    // Do not transmit URL query strings, gclid, user financial/contact information.
    const privacy = document.querySelector('.policy:last-of-type p');
    if (privacy) privacy.textContent = 'アクセス解析にGoogle Analyticsを使用します。操作イベントとクエリを除いたページURLを送信します。Cookie等が使用される場合があります。Googleのプライバシーポリシーもご確認ください。';
  }
  function track(event, fields = {}) {
    const payload = {...fields, business_type:businessType, experiment_id:'baseline', variant:'A', page_version:config.pageVersion || 'v2', page_location:location.origin + location.pathname};
    if (gaEnabled) gtag('event', event, payload);
    else window.dataLayer.push({event, ...payload});
    window.dispatchEvent(new CustomEvent('lp:analytics', {detail:{event,...payload}}));
  }
  const primary = {individual:['ququmo','accel','support'], corporate:['ququmo','accel','mynavi']};
  const buttons = document.querySelectorAll('[data-type]');
  const more = document.getElementById('more-providers');
  function render() {
    document.querySelectorAll('[data-card]').forEach(card => {
      const eligible = card.dataset.audience.split(' ').includes(businessType);
      card.hidden = !eligible || (!primary[businessType].includes(card.dataset.card) && !expanded);
    });
    buttons.forEach(button => {const active=button.dataset.type===businessType;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
    more.hidden = businessType !== 'corporate';
    more.setAttribute('aria-expanded',String(expanded));
    more.textContent = expanded ? '追加候補を閉じる' : '法人向けの追加候補を見る（2社）';
    document.getElementById('choice-note').textContent = businessType==='individual' ? '個人事業主に対応する3社を表示しています。各社で売掛金・請求書の条件を確認してください。' : '法人向けの3社を表示しています。ほかの2社も追加して比較できます。';
  }
  document.querySelector('.choice').hidden=false;
  buttons.forEach(button => button.addEventListener('click',()=>{businessType=button.dataset.type;expanded=false;render();track('business_type_select');}));
  more.addEventListener('click',()=>{expanded=!expanded;render();track('comparison_expand',{expanded});});
  document.querySelectorAll('[data-track]').forEach(link=>link.addEventListener('click',()=>track(link.dataset.provider?'provider_outbound':'compare_click',{cta_id:link.dataset.track,provider:link.dataset.provider||'none',link_kind:link.dataset.provider?'official':'internal'})));
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.contactEmail || '')) {
    const contact=document.getElementById('contact');contact.textContent='掲載内容に関するお問い合わせ：';
    const link=document.createElement('a');link.href='mailto:'+config.contactEmail;link.textContent=config.contactEmail;contact.appendChild(link);
  }
  render();track('page_view');
})();
