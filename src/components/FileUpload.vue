<template>
	<div>
		<div>
			<input ref="uploadFile" type="file" name="avatar" multiple accept=".png, .jpg, .jpeg"
				@input="selectedFile($event)" class="d-none" />
		</div>
		<div class="d-flex">
			<div class="avatars" @click="handleImg()">
				Upload ảnh
			</div>
			<div class="list-img-upload">
				<Container @drop="onDrop($event)" orientation="horizontal">
					<Draggable v-for="(img, index) in listImg" :key="index" :fire-related-events-only="true">
						<div class="draggable-item" style="position: relative">
							<div style="position: relative" class="my-container">
								<img :src="img" alt="" class="img-upload">
							</div>
							<div class="icon-setting" color="black" @click="handleClick(index)">
								<svg width="15" xmlns="http://www.w3.org/2000/svg"
									xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px"
									viewBox="0 0 256 256" enable-background="new 0 0 256 256" xml:space="preserve">
									<metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
									<g>
										<g>
											<path fill="#000000"
												d="M237.4,81.2L227,91.7l-62.6-62.6l10.4-10.4c11.5-11.5,30.2-11.5,41.7,0l20.9,20.9C248.9,51,248.9,69.7,237.4,81.2z M91.3,206.4c-2.9,2.9-2.9,7.5,0,10.4c2.9,2.9,7.5,2.9,10.4,0l114.8-114.7l-10.5-10.4L91.3,206.4z M39.2,154.2c-2.9,2.9-2.9,7.5,0,10.4c2.9,2.9,7.5,2.9,10.4,0L164.4,49.9l-10.4-10.4L39.2,154.2z M174.8,60.3L60,175.1c-5.8,5.8-5.8,15.1,0,20.9c5.8,5.8,15.1,5.8,20.9,0L195.7,81.2L174.8,60.3z M80.9,227.2c-3.5-3.5-5.2-8-5.9-12.6c-1.5,0.2-3,0.5-4.6,0.5c-7.9,0-15.3-3.1-20.9-8.6c-5.6-5.6-8.6-13-8.6-20.9c0-1.4,0.2-2.8,0.4-4.2c-4.8-0.7-9.2-2.7-12.6-6.2c-0.3-0.3-0.5-0.8-0.7-1.1l-18,72l71.9-18C81.5,227.7,81.2,227.5,80.9,227.2z" />
										</g>
									</g>
								</svg>
							</div>
							<div class="icon-setting-close" color="black" @click="removeImg(index)">
								<svg width="10" xmlns="http://www.w3.org/2000/svg"
									xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px"
									viewBox="0 0 256 256" enable-background="new 0 0 256 256" xml:space="preserve">
									<metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
									<g>
										<g>
											<g>
												<path fill="#000000"
													d="M29.7,29.7L10,49.4l39.3,39.3L88.6,128l-39.3,39.3L10,206.6l19.7,19.7L49.4,246l39.3-39.3l39.3-39.3l39.3,39.3l39.3,39.3l19.7-19.7l19.7-19.7l-39.3-39.3L167.4,128l39.3-39.3L246,49.4l-19.7-19.7L206.6,10l-39.3,39.3L128,88.6L88.7,49.3L49.4,10L29.7,29.7z" />
											</g>
										</g>
									</g>
								</svg>
							</div>
							<div class="up-avatar" v-if="setting == index" @click="handleEvent(index)">Đặt hình đại diện
							</div>
						</div>
					</Draggable>
				</Container>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

import { Container, Draggable } from "vue-dndrop";
import { ref, watch } from 'vue';

const props = defineProps({
	modelValue: {
		type: [Array, String],
		default: () => ([]),
	}
})

const emits = defineEmits(["update:modelValue"]);
const uploadFile = ref()
const listImg = ref<any>([])
const setting = ref(-1)


const selectedFile = async (e: any) => {
	const files = e.target.files;
	if (files) {
		for (var i = 0; i < files.length; i++) {
			const file = files[i];
			const url = URL.createObjectURL(file);
			listImg.value.push(url)
		}
	}
}

const removeImg = (idx: number) => {
	listImg.value.splice(idx, 1)
	listImg.value.map((e: any, index: number) => e.numberOrder = index)
	emits("update:modelValue", listImg.value)
}

const handleImg = () => {
	uploadFile.value.click()
}

const handleEvent = (index: number) => {
	listImg.value.unshift(listImg.value[index])
	listImg.value.splice(index + 1, 1)
	setting.value = -1
	listImg.value.map((e: any, index: number) => e.numberOrder = index)
	emits("update:modelValue", listImg.value)
}

const handleClick = (idx: number) => {
	if (setting.value == idx) {
		setting.value = -1
	} else {
		setting.value = idx
	}
}

const applyDrag = (arr: any, dragResult: any) => {
	const { removedIndex, addedIndex, payload } = dragResult;
	if (removedIndex === null && addedIndex === null) return arr;

	const result = [...arr];
	let itemToAdd = payload;

	if (removedIndex !== null) {
		itemToAdd = result.splice(removedIndex, 1)[0];
	}

	if (addedIndex !== null) {
		result.splice(addedIndex, 0, itemToAdd);
	}

	return result
};

const onDrop = (dropResult: any) => {
	listImg.value = applyDrag(listImg.value, dropResult);
}


const unwatch = watch(
	() => props.modelValue,
	() => {
		unwatch()
		listImg.value = props.modelValue
	}
);
</script>

<style lang="scss" scoped>
.d-none {
	display: none;
}

.d-flex {
	display: flex;
}

.avatars {
	border: 1px dashed #d6d6d6;
	width: 190px;
	height: 180px;
	border-radius: 4px;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	min-width: 190px;
	margin-right: 7px;
	margin-top: 6px;
}


.list-img-upload {
	display: flex;
	overflow-x: auto;
	padding-bottom: 2px;
	padding-top: 6px;
	max-width: 100vh;

	&::-webkit-scrollbar {
		height: 10px;
	}

	&::-webkit-scrollbar-thumb {
		background-color: #888888;
	}

	.img-upload {
		width: 190px;
		height: 180px;
		border-radius: 4px;
		margin-right: 7px;
	}

	.icon-setting-close,
	.icon-setting {
		background-color: white;
		border-radius: 50%;
		position: absolute;
		bottom: -0px;
		right: 2px;
		cursor: pointer;
		width: 25px;
		height: 25px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.icon-setting-close {
		top: -6px;
		right: 0px;
	}

	.up-avatar {
		background-color: white;
		position: absolute;
		color: black;
		padding: 4px;
		border-radius: 20px;
		font-size: 10px;
		right: 18px;
		bottom: 0px;
		cursor: pointer;
		pointer-events: auto;
	}
}
</style>