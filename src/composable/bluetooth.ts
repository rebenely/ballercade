/// <reference types="web-bluetooth" />

export async function useBluetooth(
  serviceUuid: string,
  characteristicUuid: string,
): Promise<{
  device: BluetoothDevice;
  server: BluetoothRemoteGATTServer;
  service: BluetoothRemoteGATTService;
  characteristic: BluetoothRemoteGATTCharacteristic;
}> {
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ services: [serviceUuid] }],
  });

  if (!device.gatt) {
    throw new Error('Cannot find GATT');
  }
  const server = await device.gatt.connect();
  const service = await server.getPrimaryService(serviceUuid);

  const characteristic = await service.getCharacteristic(characteristicUuid);

  await characteristic.startNotifications();

  return { device, server, service, characteristic };
}
