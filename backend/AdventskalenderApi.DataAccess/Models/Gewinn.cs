// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using System;
using System.ComponentModel.DataAnnotations;
using BeerBest.Infrastructure.Abstract;

namespace AdventskalenderApi.DataAccess.Models
{
    public class Gewinn : IEntityBase<Guid>, IHasTenantId<string>
    {
        [Key]
        public Guid Id { get; set; }
        string IHasTenantId<string>.TenantId { get; set; }
        public int Tag { get; set; }
        public int Losnummer { get; set; }
        public string Beschreibung { get; set; }
    }
}