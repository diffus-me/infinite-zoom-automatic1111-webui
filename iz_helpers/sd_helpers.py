from modules.processing import (
    process_images,
    StableDiffusionProcessingTxt2Img,
    StableDiffusionProcessingImg2Img,
    build_decoded_params_from_processing,
    get_function_name_from_processing
)
import modules.shared as shared
from modules.system_monitor import (
    generate_function_name, monitor_call_context)

import gradio as gr


def renderTxt2Img(
    request: gr.Request, prompt, negative_prompt, sampler, steps, cfg_scale, seed, width, height, all_model_info
):
    processed = None
    p = StableDiffusionProcessingTxt2Img(
        sd_model=shared.sd_model,
        outpath_samples=shared.opts.outdir_txt2img_samples,
        outpath_grids=shared.opts.outdir_txt2img_grids,
        prompt=prompt,
        negative_prompt=negative_prompt,
        seed=seed,
        sampler_name=sampler,
        n_iter=1,
        steps=steps,
        cfg_scale=cfg_scale,
        width=width,
        height=height,
    )
    p.set_request(request)
    p.set_all_model_info(all_model_info)
    with monitor_call_context(
        request,
        get_function_name_from_processing(p),
        generate_function_name(renderTxt2Img),
        decoded_params=build_decoded_params_from_processing(p),
        feature_type="buttons",
        feature_name="InfiniteZoom",
    ):
        processed = process_images(p)
    newseed = p.seed
    return processed, newseed


def renderImg2Img(
    request: gr.Request,
    prompt,
    negative_prompt,
    sampler,
    steps,
    cfg_scale,
    seed,
    width,
    height,
    init_image,
    mask_image,
    inpainting_denoising_strength,
    inpainting_mask_blur,
    inpainting_fill_mode,
    inpainting_full_res,
    inpainting_padding,
    all_model_info,
):
    processed = None

    p = StableDiffusionProcessingImg2Img(
        sd_model=shared.sd_model,
        outpath_samples=shared.opts.outdir_img2img_samples,
        outpath_grids=shared.opts.outdir_img2img_grids,
        prompt=prompt,
        negative_prompt=negative_prompt,
        seed=seed,
        sampler_name=sampler,
        n_iter=1,
        steps=steps,
        cfg_scale=cfg_scale,
        width=width,
        height=height,
        init_images=[init_image],
        denoising_strength=inpainting_denoising_strength,
        mask_blur=inpainting_mask_blur,
        inpainting_fill=inpainting_fill_mode,
        inpaint_full_res=inpainting_full_res,
        inpaint_full_res_padding=inpainting_padding,
        mask=mask_image,
    )
    # p.latent_mask = Image.new("RGB", (p.width, p.height), "white")
    p.set_request(request)
    p.set_all_model_info(all_model_info)

    with monitor_call_context(
        request,
        get_function_name_from_processing(p),
        generate_function_name(renderImg2Img),
        decoded_params=build_decoded_params_from_processing(p),
        feature_type="buttons",
        feature_name="InfiniteZoom",
    ):
        processed = process_images(p)
    # For those that use Image grids this will make sure that ffmpeg does not crash out
    if (len(processed.images) > 1) and (processed.images[0].size[0] != processed.images[-1].size[0]):
        processed.images.pop(0)
        print("\nGrid image detected applying patch")
    
    newseed = p.seed
    return processed, newseed
