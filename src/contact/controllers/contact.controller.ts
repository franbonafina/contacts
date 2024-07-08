import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { CreateContactDto } from './dtos/create-contact.dto';
import { UpdateContactDto } from './dtos/update-contact.dto';
import { QueryPersonalDataDto } from './dtos/query-personal-data.dto';
import { CreateContactService } from '../services/create-contact.service';
import { SearchContactService } from '../services/search-contact.service';
import { UpdateContactService } from '../services/update-contact.service';
import { RemoveContactService } from '../services/remove-contact.service';

@ApiTags('contacts')
@Controller('contacts')
export class ContactsController {
  constructor(
    private readonly createContactsService: CreateContactService,
    private readonly searchContactsService: SearchContactService,
    private readonly updateContactsService: UpdateContactService,
    private readonly removeContactsService: RemoveContactService,
  ) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Contact created successfully' })
  async create(@Body() createContactDto: CreateContactDto) {
    const createdContact = await this.createContactsService.create(
      createContactDto,
    );

    console.log(
      `New contact created successfully with ID: ${createdContact.id}`,
    );
    return {
      statusCode: 201,
      message: 'Contact created successfully',
      data: createdContact,
    };
  }

  @Get(':email')
  @ApiResponse({ status: 200, description: 'Found contact by email' })
  @ApiNotFoundResponse({ description: 'Contact not found' })
  async findByEmail(@Param('email') email: string) {
    const foundContact = await this.searchContactsService.findByEmail(email);
    if (!foundContact) {
      throw new NotFoundException('Contact not found');
    }
    return {
      statusCode: 200,
      message: 'Found contact by email',
      data: foundContact,
    };
  }

  @Get('search')
  @ApiResponse({
    status: 200,
    description: 'Found contacts by search criteria',
  })
  async findByQuery(@Body() queryDto: QueryPersonalDataDto) {
    const foundContacts = await this.searchContactsService.findByPersonalData(
      queryDto,
    );
    return {
      statusCode: 200,
      message: 'Found contacts by search criteria',
      data: foundContacts,
    };
  }

  @Get('phone')
  @ApiResponse({
    status: 200,
    description: 'Found contacts by phone number and type',
  })
  async findByPhoneNumber(
    @Body('phoneNumber') phoneNumber: string,
    @Body('phoneType') phoneType: string,
  ) {
    const foundContacts = await this.searchContactsService.findByPhoneNumber(
      phoneNumber,
      phoneType,
    );
    return {
      statusCode: 200,
      message: 'Found contacts by phone number and type',
      data: foundContacts,
    };
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Contact updated successfully' })
  @ApiNotFoundResponse({ description: 'Contact not found' })
  async update(
    @Param('id') id: number,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    const updatedContact = await this.updateContactsService.update(
      id,
      updateContactDto,
    );
    return {
      statusCode: 200,
      message: 'Contact updated successfully',
      data: updatedContact,
    };
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Contact deleted successfully' })
  @ApiNotFoundResponse({ description: 'Contact not found' })
  async delete(@Param('id') id: number) {
    const deletedContact = await this.removeContactsService.delete(id);
    return {
      statusCode: 200,
      message: 'Contact deleted successfully',
      data: deletedContact,
    };
  }
}
