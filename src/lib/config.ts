import { createBlock, createConfig, createGroup, createPanel, createLabel } from './config.builder';
import { EditInterface, EditPlaintext } from './config.interfaces';

export default createConfig('http://47.89.8.92:3008/v1', '64468f8f585ce246c264')
	.setName('Gateway Manager')
    .addGroup( createGroup()
		.setName('Gateways')
		.addPanel( createPanel('644690130699e6fbd4a2', '64895f70d9a400b1b039')
		    .setName('Gateways')
			.addLabel(createLabel('gwID'))
		    .addBlock(createBlock('gwID'))
		    .addBlock(createBlock('gwModel'))
		    .addBlock(createBlock('gwIP').setEditInterface(new EditPlaintext().setEditDisabled(true)))
		    .addBlock(createBlock('region'))
		    .addBlock(createBlock('status'))
		    .addBlock(createBlock('serverAddr').delListInterface())
		    .addBlock(createBlock('operate'))
		    .addBlock(createBlock('service').delListInterface())
		    .addBlock(createBlock('gwLocation').delListInterface())
		    .addBlock(createBlock('desc').delListInterface()))
	)

	.addGroup( createGroup()
		.setName('System')
		.addPanel( createPanel('644690130699e6fbd4a2', '6499488505e6adf079a3')	
			.setName('members')
			.setCreateEnabled(false)
		)
		.addPanel( createPanel('644690130699e6fbd4a2', '6499488505e6adf079a3')	
			.setName('organization')
			.setCreateEnabled(false)
		)
	)
