<script setup lang="ts">
import { BallercadeButton, BallercadeInput } from '@/components';
import { useBallercade } from '@/stores/ballercade';
import { onMounted } from 'vue';
import { useForm } from 'vee-validate';
import { stringToUint8Array } from '@/composable/bluetooth';
import router from '@/router';

const { settingsCharacteristic } = useBallercade();
const { handleSubmit, setFieldValue } = useForm<FormValues>({});
interface FormValues {
  range: number;
  delay: number;
}

onMounted(async () => {
  const settingsVal = await settingsCharacteristic?.readValue();
  const decoder = new TextDecoder('utf-8');
  const settingsStr = decoder.decode(settingsVal);

  const valArr = settingsStr.split(',');
  if (valArr.length != 2) {
    console.log('error brah');
    return;
  }

  setFieldValue('range', Number(valArr[0]));
  setFieldValue('delay', Number(valArr[1]));
});
const validateRange = (val: number, minVal: number, maxVal: number) => {
  if (val < minVal || val > maxVal) {
    return `Must be between ${minVal} and ${maxVal}`;
  }

  return true;
};

const saveValues = handleSubmit(async (values: FormValues) => {
  console.log(values);
  const valStr = `${values.range},${values.delay}`;
  await settingsCharacteristic?.writeValue(stringToUint8Array(valStr));
  router.push('/menu');
});
</script>

<template>
  <main class="flex items-center justify-center flex-col gap-6">
    <div class="flex justify-center flex-col gap-4 w-full md:w-1/2">
      <BallercadeInput
        id="range"
        name="range"
        type="number"
        class="hide-arrow"
        :rules="(val: number) => validateRange(val, 30, 999)"
      >
        <template #label> Range Threshold </template>
      </BallercadeInput>

      <BallercadeInput
        id="delay"
        name="delay"
        type="number"
        class="hide-arrow"
        :rules="(val: number) => validateRange(val, 10, 9999)"
      >
        <template #label> Score Delay </template>
      </BallercadeInput>

      <BallercadeButton @click="saveValues">Save</BallercadeButton>
    </div>
  </main>
</template>
