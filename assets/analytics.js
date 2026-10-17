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
    // Privacy information is in static HTML; preserve its policy links.
  }
  function track(event, fields = {}) {
    const payload = {...fields, business_type:sameAudience?'unspecified':businessType, experiment_id:'baseline', variant:'A', page_version:config.pageVersion || 'v2', page_location:location.origin + location.pathname};
    if (gaEnabled) gtag('event', event, payload);
    else window.dataLayer.push({event, ...payload});
    window.dispatchEvent(new CustomEvent('lp:analytics', {detail:{event,...payload}}));
  }
  const primary = {individual:['ququmo','accel','support'], corporate:['ququmo','accel','mynavi']};
  const cards = Array.from(document.querySelectorAll('[data-card]'));
  const active = card => Array.isArray(config.activeProviders) ? config.activeProviders.includes(card.dataset.card) : card.dataset.releaseState !== 'pending';
  const eligibleFor = type => cards.filter(card => active(card) && card.dataset.audience.split(' ').includes(type));
  const sameAudience = eligibleFor('individual').map(card => card.dataset.card).join(',') === eligibleFor('corporate').map(card => card.dataset.card).join(',');
  const buttons = document.querySelectorAll('[data-type]');
  const more = document.getElementById('more-providers');
  function render() {
    cards.forEach(card => {
      const eligible = card.dataset.audience.split(' ').includes(businessType);
      card.hidden = !active(card) || !eligible || (!primary[businessType].includes(card.dataset.card) && !expanded);
    });
    buttons.forEach(button => {const active=button.dataset.type===businessType;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
    const extraCount = eligibleFor(businessType).filter(card => !primary[businessType].includes(card.dataset.card)).length;
    more.hidden = businessType !== 'corporate' || extraCount === 0;
    more.setAttribute('aria-expanded',String(expanded));
    more.textContent = expanded ? '追加候補を閉じる' : `法人向けの追加候補を見る（${extraCount}社）`;
    const visibleCount = cards.filter(card => !card.hidden).length;
    document.getElementById('choice-note').textContent = sameAudience ? '個人事業主・法人向けのサービス紹介です。対象となる請求書や必要書類などの条件を確認してください。' : `${businessType==='individual'?'個人事業主':'法人'}向けの${visibleCount}社を表示しています。各社の条件を確認してください。`;
  }
  document.querySelector('.choice').hidden=sameAudience;
  buttons.forEach(button => button.addEventListener('click',()=>{businessType=button.dataset.type;expanded=false;render();track('business_type_select');}));
  more.addEventListener('click',()=>{expanded=!expanded;render();track('comparison_expand',{expanded});});
  document.querySelectorAll('[data-track]').forEach(link=>link.addEventListener('click',event=>{
    if (link.dataset.provider && (config.previewMode || link.dataset.previewCta)) {
      event.preventDefault();
      track('cta_click',{cta_id:link.dataset.track,provider:link.dataset.provider,link_kind:'disabled',disabled:true});
      return;
    }
    track(link.dataset.provider?'provider_outbound':'compare_click',{cta_id:link.dataset.track,provider:link.dataset.provider||'none',link_kind:link.dataset.provider?'official':'internal'});
  }));
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.contactEmail || '')) {
    const contact=document.getElementById('contact');contact.textContent='掲載内容に関するお問い合わせ：';
    const link=document.createElement('a');link.href='mailto:'+config.contactEmail;link.textContent=config.contactEmail;contact.appendChild(link);
  }
  render();track('page_view');
  // A click on an anchor is not proof that the service section was displayed.
  // Observe the heading rather than the entire (potentially very tall) section.
  const compareHeading = document.querySelector('#compare h2');
  if (compareHeading && typeof IntersectionObserver === 'function') {
    let viewed = false;
    const observer = new IntersectionObserver(entries => {
      if (!viewed && entries.some(entry => entry.target === compareHeading && entry.isIntersecting && entry.intersectionRatio >= 0.5)) {
        viewed = true;
        track('compare_view', {section_id:'compare'});
        observer.disconnect();
      }
    }, {threshold:0.5, rootMargin:'0px 0px -90px 0px'});
    observer.observe(compareHeading);
  }
})();
