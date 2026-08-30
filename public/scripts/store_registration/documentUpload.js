// documentUpload.js - مدیریت بارگذاری مدارک در مرحله ۴

(function() {
    const DOCUMENTS = [
        { id: 'doc-1', title: 'عنوان مدرک مورد نیاز', required: true },
        { id: 'doc-2', title: 'عنوان مدرک مورد نیاز', required: true },
        { id: 'doc-3', title: 'عنوان مدرک مورد نیاز', required: true },
        { id: 'doc-4', title: 'عنوان مدرک مورد نیاز', required: true },
    ];

    const docListEl = document.getElementById('docList');
    const confirmBtn = document.getElementById('confirmBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const state = {};

    const ICONS = {
        upload: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
        trash: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>`,
        eye: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>`,
        refresh: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>`,
        check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 16 9"/></svg>`,
        doc: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>`,
    };

    function badgeHtml(required) {
        if (!required) return '';
        return `<span class="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md bg-custom-yellow text-[11px] font-IRANSansXMedium text-amber-800"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span><span>الزامی</span></span>`;
    }

    function emptyRowHtml(doc) {
        return `<div class="flex items-center justify-between bg-white border border-custom-gray rounded-xl p-5 gap-4 flex-wrap" data-row="${doc.id}" role="listitem">
            <div class="flex items-center gap-3">
                <span class="w-11 h-11 rounded-lg bg-custom-brown/10 text-custom-brown flex items-center justify-center shrink-0">${ICONS.doc}</span>
                <div class="text-right">
                    <p class="text-[13.5px] font-IRANSansXMedium text-custom-black">${doc.title}</p>
                    ${badgeHtml(doc.required)}
                </div>
            </div>
            <div>
                <label class="flex items-center gap-2 h-11 px-5 rounded-[10px] border border-dashed border-custom-gray text-[13px] font-IRANSansXMedium text-custom-black cursor-pointer hover:border-custom-brown hover:text-custom-brown transition-colors">
                    <span>انتخاب فایل</span>
                    <span class="text-current">${ICONS.upload}</span>
                    <input type="file" class="hidden" data-input="${doc.id}" accept=".pdf,.jpg,.jpeg,.png" aria-label="انتخاب فایل برای ${doc.title}" />
                </label>
                <p class="hidden text-[12px] text-red-600 font-IRANSansXRegular mt-1.5 text-left" data-error="${doc.id}"></p>
            </div>
        </div>`;
    }

    function successRowHtml(doc, file) {
        const sizeMB = Validator.formatFileSizeMB(file.size);
        return `<div class="flex items-center justify-between bg-white border border-custom-gray rounded-xl p-5 gap-4 flex-wrap" data-row="${doc.id}" role="listitem">
            <div class="flex items-center gap-3">
                <span class="w-11 h-11 rounded-lg bg-custom-brown/10 text-custom-brown flex items-center justify-center shrink-0">${ICONS.doc}</span>
                <div class="text-right">
                    <p class="text-[13.5px] font-IRANSansXMedium text-custom-black">${doc.title}</p>
                    ${badgeHtml(doc.required)}
                </div>
            </div>
            <div class="flex items-center gap-3 flex-wrap">
                <div class="flex items-center gap-2">
                    <span class="text-green-600 shrink-0">${ICONS.check}</span>
                    <div class="text-[12.5px] leading-[1.7]">
                        <p class="text-custom-black font-IRANSansXMedium">بارگزاری با موفقیت انجام شد.</p>
                        <p class="text-custom-black/50 font-IRANSansXRegular" dir="ltr">${file.name}&nbsp;&nbsp;${sizeMB} مگابایت</p>
                    </div>
                </div>
                <label class="flex items-center gap-1.5 h-10 px-4 rounded-[10px] border border-custom-gray text-[13px] font-IRANSansXMedium text-custom-black cursor-pointer hover:border-custom-brown hover:text-custom-brown transition-colors">
                    <span>جایگزینی</span>
                    <span class="text-current">${ICONS.refresh}</span>
                    <input type="file" class="hidden" data-input="${doc.id}" accept=".pdf,.jpg,.jpeg,.png" aria-label="جایگزینی فایل برای ${doc.title}" />
                </label>
                <button type="button" data-preview="${doc.id}" class="w-10 h-10 flex items-center justify-center rounded-[10px] border border-custom-gray text-custom-black hover:border-custom-brown hover:text-custom-brown transition-colors" aria-label="پیش‌نمایش فایل ${doc.title}">${ICONS.eye}</button>
                <button type="button" data-delete="${doc.id}" class="w-10 h-10 flex items-center justify-center rounded-[10px] border border-custom-gray text-custom-black hover:border-red-500 hover:text-red-600 transition-colors" aria-label="حذف فایل ${doc.title}">${ICONS.trash}</button>
            </div>
        </div>`;
    }

    function renderRow(doc) {
        const row = state[doc.id];
        const html = row && row.file ? successRowHtml(doc, row.file) : emptyRowHtml(doc);
        const existing = docListEl.querySelector(`[data-row="${doc.id}"]`);
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html.trim();
        const newEl = wrapper.firstChild;
        if (existing) existing.replaceWith(newEl);
        else docListEl.appendChild(newEl);
        bindRowEvents(doc);
    }

    function bindRowEvents(doc) {
        const rowEl = docListEl.querySelector(`[data-row="${doc.id}"]`);
        if (!rowEl) return;

        const fileInputs = rowEl.querySelectorAll(`[data-input="${doc.id}"]`);
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => handleFileSelect(doc, e.target.files[0]));
        });

        const deleteBtn = rowEl.querySelector(`[data-delete="${doc.id}"]`);
        if (deleteBtn) deleteBtn.addEventListener('click', () => handleDelete(doc));

        const previewBtn = rowEl.querySelector(`[data-preview="${doc.id}"]`);
        if (previewBtn) previewBtn.addEventListener('click', () => handlePreview(doc));
    }

    function showError(doc, message) {
        const errEl = docListEl.querySelector(`[data-error="${doc.id}"]`);
        if (!errEl) return;
        errEl.textContent = message;
        errEl.classList.toggle('hidden', !message);
    }

    function handleFileSelect(doc, file) {
        const result = Validator.validateFile(file, { maxSizeMB: 10 });
        if (!result.valid) {
            showError(doc, result.message);
            return;
        }
        if (state[doc.id] && state[doc.id].objectUrl) {
            URL.revokeObjectURL(state[doc.id].objectUrl);
        }
        state[doc.id] = { file, objectUrl: URL.createObjectURL(file) };
        renderRow(doc);
        updateConfirmState();
    }

    function handleDelete(doc) {
        if (state[doc.id] && state[doc.id].objectUrl) {
            URL.revokeObjectURL(state[doc.id].objectUrl);
        }
        delete state[doc.id];
        renderRow(doc);
        updateConfirmState();
    }

    function handlePreview(doc) {
        const row = state[doc.id];
        if (row && row.objectUrl) window.open(row.objectUrl, '_blank');
    }

    function updateConfirmState() {
        const allRequiredUploaded = DOCUMENTS.filter(d => d.required).every(d => state[d.id] && state[d.id].file);
        if (allRequiredUploaded) {
            confirmBtn.disabled = false;
            confirmBtn.classList.remove('bg-custom-brown/10', 'text-custom-brown/40', 'cursor-not-allowed');
            confirmBtn.classList.add('bg-custom-brown', 'text-white', 'cursor-pointer', 'hover:bg-custom-brown/90');
        } else {
            confirmBtn.disabled = true;
            confirmBtn.classList.add('bg-custom-brown/10', 'text-custom-brown/40', 'cursor-not-allowed');
            confirmBtn.classList.remove('bg-custom-brown', 'text-white', 'cursor-pointer', 'hover:bg-custom-brown/90');
        }
    }

    confirmBtn.addEventListener('click', () => {
        if (confirmBtn.disabled) return;
        confirmBtn.textContent = 'در حال ارسال...';
        confirmBtn.disabled = true;
        setTimeout(() => {
            window.location.href = 'store_registration_step_5.html';
        }, 600);
    });

    cancelBtn.addEventListener('click', () => {
        if (!confirm('آیا از انصراف مطمئن هستید؟ فایل‌های بارگذاری‌شده حذف می‌شوند.')) return;
        DOCUMENTS.forEach(handleDelete);
    });

    // مقداردهی اولیه
    DOCUMENTS.forEach(renderRow);
    updateConfirmState();
})();