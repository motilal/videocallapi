<?php
$this_editsingle_url_pre = 'brandadmin/images/editsingle/'.$ArchiveDetail['BrandId'];
?>
{% for (var i=0, file; file=o.files[i]; i++) { %}
{% if (!file.thumbnailUrl) { %}
<div class="image-uploading d-block d-md-flex align-items-center">
    {% if (!file.error) { %}
    <div class="uploading-image-box"></div>
    {% } else { %}
    <div class="uploading-image-box error d-flex align-items-center justify-content-center">
        <i class="fa fa-exclamation-triangle mr-1" aria-hidden="true"></i>
    </div>
    {% } %}
    <div class="uploading-image-title">
        <h6>Image Uploading</h6>
        <p>
            <img src="<?= asset_url('img/brandadmin/icon_upload_img.png'); ?>" alt="icon_upload_img" />
            {%=file.name%}
        </p>
        <div class="uploading-progress-group">
            {% if (file.error) { %}
            <div class="progress uploading-progress">
                <div class="progress-bar error-progress-bar uploading-progress-bar progress-complete-bar progress_bar" role="progressbar" style="width:100%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                    <span>0%</span>
                </div>
            </div>
            <div class="error mt-1">
                <i class="fa fa-exclamation-triangle mr-1" aria-hidden="true"></i>{%=file.error%}
            </div>
            {% } else { %}
            <div class="progress uploading-progress">
                <div class="progress-bar uploading-progress-bar progress_bar" role="progressbar" style="width:0;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                    <span class="progress_completed">0%</span>
                    <div class="processing">Processing</div>
                </div>
            </div>
            {% } %}
            <button class="mt-3 btn btn-primary cancel">
                <i class="fas fa-ban"></i>
                <span>Cancel</span>
            </button>
        </div>
    </div>
</div>

{% } else { %}

<div class="image-uploading single-upload d-md-flex d-block align-items-center">
    <div class="single-upload-left d-inline-flex align-items-center">
        <div class="single-upload-select">
            <div class="custom-control custom-checkbox parent-checkbox-action">
                <input type="checkbox" class="custom-control-input table-check" name="ids[]" value="{%=file.id%}" id="check{%=file.id%}">
                <label class="custom-control-label" for="check{%=file.id%}">&nbsp;</label>
            </div>
        </div>
        <div class="uploading-image-box d-flex align-items-center justify-content-center">
            <img src="{%=file.thumbnailUrl%}" alt="single-img-uploaded" />
        </div>
    </div>
    <div class="single-upload-right d-inline-flex align-items-center">
        <div class="single-upload-detail">
            <div class="upload-img-name">{%=file.name%}</div>
            <div class="single-upload-description">
                <div class="row">
                    <div class="col-lg-6">
                        <ul>
                            <li>
                                <input type="hidden" name="Id[{%=file.id%}]" value="{%=file.id%}">
                                <p>Title:</p>
                                <input id="Title_{%=file.id%}" name="Title[{%=file.id%}]" type="text" class="U_TitleFull_{%=file.id%} form-control" placeholder="Enter title" value="{%=file.data['Title']%}" required>
                                <span class="edit-img-detail">
                                    {% if (file.data['Title']) { %}
                                    <i class="fas fa-check-circle"></i>
                                    {% } %}
                                </span>
                            </li>

<?php /* * / ?>
                            <li>
                                <p>Price:</p>
                                <input id="Price_{%=file.id%}" name="Price[{%=file.id%}]" type="number" step="0.01" class="U_Price_{%=file.id%} form-control" placeholder="Enter price" value="{%=file.data['Price']%}">
                                <span class="edit-img-detail">
                                    {% if (file.data['Price']) { %}
                                    <i class="fas fa-check-circle"></i>
                                    {% } %}
                                </span>
                            </li>
<?php /* */ ?>
<?php /* // Unfinished */ ?>
{% if (file.data['Pricing']) { %}
{% for (var p=0, price; price=file.data['Pricing'][p]; p++) { %}
                            <li>
                                <p>{%=file.data['Pricing'][p]['symbol']%} Price:</p>
                                <input id="Pricing_{%=file.id%}_{%=file.data['Pricing'][p]['symbol']%}" name="Pricing[{%=file.id%}][{%=file.data['Pricing'][p]['symbol']%}]" type="number" step="0.01" class="U_Pricing_{%=file.id%}_{%=file.data['Pricing'][p]['symbol']%} form-control" placeholder="Enter price" value="{%=file.data['Pricing'][p]['price']%}">
                                <span class="edit-img-detail">
                                    {% if (file.data['Pricing'][p]['price']) { %}
                                    <i class="fas fa-check-circle"></i>
                                    {% } %}
                                </span>
                            </li>
{% } %}
{% } %}
<?php /**/ ?>
                            <li>
                                <p>Category:</p>
                                <select class="U_CategoryId_{%=file.id%} form-control" id="CategoryId_{%=file.id%}" name="CategoryId[{%=file.id%}]" required>
                                    <?= $this->categorymodel->cat_dropdown_v1($ArchiveDetail['BrandId'], $ArchiveDetail['BrandOwnerId']); ?>
                                </select>
                                <span class="edit-img-detail"></span>
                            </li>
                        </ul>
                    </div>
                    <div class="col-lg-6">
                        <ul>
                            <li>
                                <p>Start Date:</p>
                                <div class="uedittxt">
                                    <input id="StartDate_{%=file.id%}" type="text" class="U_StartDate_{%=file.id%} form-control startdatep" name="StartDate[{%=file.id%}]" placeholder="dd/mm/yyyy" value="{%=file.data['StartDate']%}">
                                    <span class="edit-img-detail">
                                        {% if (file.data['StartDate']) { %}
                                        <i class="fas fa-check-circle"></i>
                                        {% } %}
                                    </span>
                                </div>
                            </li>
                            <li>
                                <p>Keywords:</p>
                                <div class="uedittxt">
                                    <input id="Keywords_{%=file.id%}" type="text" class="U_KeywordsFull_{%=file.id%} form-control" name="Keywords[{%=file.id%}]" placeholder="Separate with commas" value="">
                                    <span class="edit-img-detail">
                                        {% if (file.data['Keywords']) { %}
                                        <i class="fas fa-check-circle"></i>
                                        {% } %}
                                    </span>
                                    <?php if ($ArchiveDetail['brand_info']->isEnableAutoKeyword == '1') { /* this should if autoenable is false! */ ?>
                                        <a href="#" class="autokeyword" id="autokeyword_{%=file.id%}" data-reftype="upload" data-id="{%=file.id%}" data-action="<?= site_url("brandadmin/images/getImageEntities/".$ArchiveDetail['BrandId']); ?>">
                                            <?php /*+ Auto Keywords*/ ?>
                                        </a>
                                    <?php } ?>
                                </div>
                            </li>
                            <li>
                                <p>Tags:</p>
                                <div class="upload-div-tags">
                                    <select id="GlobalCategory_{%=file.id%}" class="U_GlobalCategory_{%=file.id%} upload-global-cat-list d-block" name="GlobalCategory[{%=file.id%}][]" autocomplete="none" multiple>
                                        <?php foreach ($global_categories as $gkey => $gcat) { ?>
                                            <optgroup label="<?= $gkey; ?>">
                                                <?php foreach ($gcat as $gkey1 => $gcat1) { ?>
                                                    <option value="<?= $gkey1; ?>"><?= $gcat1; ?></option>
                                                <?php } ?>
                                            </optgroup>
                                        <?php } ?>
                                    </select>
                                    <span class="edit-img-detail"></span>
                                </div>
                            </li>
                            <div class="d-none U_Id_{%=file.id%}"></div>
                            <li>
                                <div class="w-100">
                                    <button type="button" class="btn btn-dark float-right save-single-upload">Save</button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="single-upload-edit">
            <span class="editclick"><img src="<?= asset_url('img/brandadmin/icon_edit.png'); ?>" alt="icon_edit" /></span>
            <div class="edits-icons">
                <a data-toggle="tooltip" data-placement="top" title="EDIT DETAILS" data-original-title="EDIT DETAILS" data-fancybox="editsingle" data-type="ajax" href="<?= site_url($this_editsingle_url_pre); ?>/{%=file.id%}" data-src="<?= site_url($this_editsingle_url_pre); ?>/{%=file.id%}" class="editsingle-popup mr-2">
                    <span><i class="fas fa-pen"></i></span>
                </a>
                <a data-toggle="tooltip" data-placement="top" data-original-title="REMOVE IMAGE" href="#" class="remove-image">
                    <i class="fas fa-trash"></i>
                </a>
            </div>
        </div>

    </div>
</div>
{% } %}

{% } %}