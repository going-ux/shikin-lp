/* No external analytics collector is configured. These are diagnostic events only. */
(() => {
  let businessType = 'individual';
  window.dataLayer = window.dataLayer || [];
  function track(event, fields = {}) {
    const payload = {event, ...fields, business_type: businessType, experiment_id: 'baseline', variant: 'A', page_version: '20261014'};
    window.dataLayer.push(payload);
    window.dispatchEvent(new CustomEvent('lp:analytics', {detail: payload}));
  }
  const buttons = document.querySelectorAll('[data-type]');
  buttons.forEach(button => button.addEventListener('click', () => {
    businessType = button.dataset.type;
    buttons.forEach(other => { const active = other === button; other.classList.toggle('active', active); other.setAttribute('aria-pressed', String(active)); });
    document.querySelector('[data-provider="no1"]').href = businessType === 'individual' ? 'https://no1service.co.jp/factoring/kojin/' : 'https://no1service.co.jp/factoring/';
    document.getElementById('choice-note').textContent = businessType === 'individual' ? 'No.1は個人事業主向けの案内へ移動します。各社で売掛先・請求書の条件を確認してください。' : 'No.1は法人向けの案内へ移動します。各社で売掛先・請求書の条件を確認してください。';
    track('business_type_select');
  }));
  document.querySelectorAll('[data-track]').forEach(link => link.addEventListener('click', () => track(link.dataset.provider ? 'provider_outbound' : 'compare_click', {cta_id: link.dataset.track, provider: link.dataset.provider || null, link_kind: link.dataset.provider ? 'official' : 'internal'})));
  track('lp_view');
})();
